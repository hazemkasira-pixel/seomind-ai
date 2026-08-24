require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function dailyPublish() {
  console.log('🚀 Starting daily auto-publish...')
  
  const now = new Date().toISOString()

  // 1. جلب كل الاشتراكات النشطة التي لم تنته بعد
  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('status', 'active')
    .gt('current_period_end', now)
  
  if (error) {
    console.error('❌ Error fetching subscriptions:', error)
    return
  }

  console.log(`📊 Found ${subscriptions ? subscriptions.length : 0} active subscriptions`)

  if (!subscriptions || subscriptions.length === 0) {
    console.log('⏭️ No active subscriptions to process.')
    return
  }

  // 2. معالجة كل اشتراك
  for (const subscription of subscriptions) {
    try {
      await processSubscription(subscription)
    } catch (err) {
      console.error(`❌ Error processing subscription ${subscription.id}:`, err)
    }
  }

  console.log('✅ Daily auto-publish completed!')
}

async function processSubscription(subscription) {
  const { user_id, articles_published, articles_limit, last_published_at, id: subId } = subscription

  // التحقق من آخر نشر (لا تنشر أكثر من مرة في اليوم)
  if (last_published_at) {
    const hoursSinceLastPublish = (new Date() - new Date(last_published_at)) / (1000 * 60 * 60)
    if (hoursSinceLastPublish < 24) {
      console.log(`⏭️ Skipping user ${user_id} - Last published ${hoursSinceLastPublish.toFixed(1)}h ago`)
      return
    }
  }

  // التحقق من حد المقالات
  if (articles_published >= articles_limit) {
    console.log(`⏭️ Skipping user ${user_id} - Monthly limit reached (${articles_published}/${articles_limit})`)
    return
  }

  console.log(`📝 Publishing article for user ${user_id}...`)

  // 3. جلب آخر تحليل للمستخدم
  const { data: analyses, error: analysisError } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (analysisError || !analyses) {
    console.log(`⚠️ No analyses found for user ${user_id}`)
    return
  }

  // 4. اختيار عنوان عشوائي من القائمة
  const titles = analyses.blog_post_titles || []
  const titlesArray = Array.isArray(titles) ? titles : (typeof titles === 'string' ? JSON.parse(titles) : [])
  
  if (titlesArray.length === 0) {
    console.log(`⚠️ No titles available for user ${user_id}`)
    return
  }

  const targetTitle = titlesArray[Math.floor(Math.random() * titlesArray.length)]
  console.log(`🎯 Selected title: "${targetTitle}"`)

  // 5. استدعاء API النشر التلقائي (ووردبريس + توليد منشور لينكدإن)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const cronSecret = process.env.CRON_SECRET

  const response = await fetch(`${appUrl}/api/auto-execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-cron-secret': cronSecret
    },
    body: JSON.stringify({
      analysisId: analyses.id
    })
  })

  if (response.ok) {
    // تحديث عدد المقالات المنشورة في الاشتراك
    await supabase
      .from('subscriptions')
      .update({
        articles_published: articles_published + 1,
        last_published_at: new Date().toISOString()
      })
      .eq('id', subId)
    
    console.log(`✅ Article published for user ${user_id} (${articles_published + 1}/${articles_limit})`)

    // ==========================================
    // 🌟 الخطوة الجديدة: النشر التلقائي على LinkedIn
    // ==========================================
    await handleLinkedInAutoPublish(user_id, analyses.id)

  } else {
    const errText = await response.text()
    console.error(`❌ Failed to publish for user ${user_id}. Response: ${errText}`)
  }
}

// 🌟 دالة جديدة للتعامل مع نشر لينكدإن
async function handleLinkedInAutoPublish(userId, analysisId) {
  console.log(`🔍 Checking LinkedIn auto-publish settings for user ${userId}...`)

  // 1. جلب حسابات لينكدإن النشطة والمفعلة للنشر التلقائي
  const { data: linkedinAccounts } = await supabase
    .from('linkedin_accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .eq('auto_publish', true)

  if (!linkedinAccounts || linkedinAccounts.length === 0) {
    console.log(`⏭️ No active LinkedIn accounts with auto-publish enabled for user ${userId}`)
    return
  }

  // 2. جلب منشور لينكدإن الذي تم توليده حديثاً لهذا التحليل
  const { data: linkedinPost } = await supabase
    .from('linkedin_posts')
    .select('*')
    .eq('user_id', userId)
    .eq('article_id', analysisId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!linkedinPost) {
    console.log(`⚠️ No generated LinkedIn post found for analysis ${analysisId}`)
    return
  }

  // 3. النشر على كل حساب مرتبط
  for (const account of linkedinAccounts) {
    try {
      await publishToLinkedIn(linkedinPost, account, userId)
    } catch (err) {
      console.error(`❌ Failed to publish to LinkedIn account ${account.account_name}:`, err)
    }
  }
}

// 🌟 دالة التواصل مع LinkedIn API
async function publishToLinkedIn(post, account, userId) {
  console.log(`📱 Publishing to LinkedIn: ${account.account_name}...`)

  const authorUrn = account.account_type === 'personal' 
    ? `urn:li:person:${account.linkedin_id}`
    : `urn:li:organization:${account.linkedin_id}`

  const linkedinPayload = {
    author: authorUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: `${post.post_content}\n\n${post.hashtags}` },
        shareMediaCategory: 'NONE'
      }
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
    }
  }

  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${account.access_token}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0'
    },
    body: JSON.stringify(linkedinPayload)
  })

  if (response.ok) {
    const data = await response.json()
    const postId = data.id
    
    // حفظ حالة النشر في قاعدة البيانات
    await supabase.from('linkedin_published_posts').insert({
      user_id: userId,
      account_id: account.id,
      post_content: post.post_content,
      hashtags: post.hashtags,
      linkedin_post_id: postId,
      post_url: `https://www.linkedin.com/feed/update/${postId}`,
      status: 'published',
      published_at: new Date().toISOString()
    })
    
    console.log(`✅ Successfully published to LinkedIn! Post ID: ${postId}`)
  } else {
    const errorData = await response.text()
    console.error(`❌ LinkedIn API Error:`, response.status, errorData)
    
    // تسجيل حالة الفشل
    await supabase.from('linkedin_published_posts').insert({
      user_id: userId,
      account_id: account.id,
      post_content: post.post_content,
      status: 'failed',
      published_at: new Date().toISOString()
    })
  }
}

// تشغيل الدالة الرئيسية
dailyPublish()