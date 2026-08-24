import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Resend } from 'resend'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_MODEL = 'llama-3.1-8b-instant'
const WP_URL = process.env.WORDPRESS_URL
const WP_USERNAME = process.env.WORDPRESS_USERNAME
const WP_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD
const RESEND_API_KEY = process.env.RESEND_API_KEY
const CLIENT_EMAIL = process.env.CLIENT_EMAIL
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'

// تهيئة Resend
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

export async function POST(request: Request) {
  try {
    // 1. التحقق من الـ Cron Secret أولاً (للنشر التلقائي الآمن)
    const cronSecret = request.headers.get('x-cron-secret')
    const isCronJob = cronSecret === process.env.CRON_SECRET

    let targetUserId = null

    if (!isCronJob) {
      const user = await currentUser()
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      targetUserId = user.id
    }

    const { analysisId } = await request.json()

    // 2. جلب بيانات التحليل
    const { data: analysis, error: dbError } = await supabaseAdmin
      .from('analyses')
      .select('*')
      .eq('id', analysisId)
      .single()

    if (dbError || !analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
    }

    // التحقق من الصلاحيات: إما المستخدم هو صاحب التحليل، أو أنه Cron Job موثوق
    if (!isCronJob && analysis.user_id !== targetUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // نستخدم user_id الخاص بالتحليل لجميع العمليات التالية
    targetUserId = analysis.user_id

    // 3. التحقق من حالة الاشتراك أو دفع التجربة ($1 Trial Check)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('subscription_status, trial_articles_used, max_trial_articles, is_trial_active')
      .eq('id', targetUserId)
      .single()

    let subscriptionStatus = profile?.subscription_status || 'trial'
    let articlesUsed = profile?.trial_articles_used || 0
    let maxTrial = profile?.max_trial_articles || 3
    let isTrialActive = profile?.is_trial_active ?? true

    if (!profile) {
      await supabaseAdmin.from('profiles').insert({
        id: targetUserId,
        subscription_status: 'trial',
        trial_articles_used: 0,
        max_trial_articles: 3,
        is_trial_active: true
      })
    }

    // إذا كان المستخدم في فترة التجربة، نتحقق من دفع الـ $1 ومن رصيد المقالات
    if (subscriptionStatus === 'trial' && isTrialActive) {
      const { data: paymentData } = await supabaseAdmin
        .from('trial_payments')
        .select('status, amount')
        .eq('user_id', targetUserId)
        .eq('status', 'succeeded')
        .single()

      if (!paymentData || paymentData.amount < 1) {
        return NextResponse.json({ 
          error: 'Please complete the $1 trial payment to start auto-publishing.',
          paymentRequired: true,
          paymentUrl: '/checkout/trial'
        }, { status: 402 })
      }

      if (articlesUsed >= maxTrial) {
        return NextResponse.json({ 
          error: 'Trial limit (3 articles) reached. Please upgrade your subscription to continue.',
          upgradeRequired: true 
        }, { status: 403 })
      }
    }

    // معالجة آمنة للعناوين والكلمات المفتاحية
    const titlesRaw = analysis.blog_post_titles || []
    const titles = Array.isArray(titlesRaw) ? titlesRaw : (typeof titlesRaw === 'string' ? JSON.parse(titlesRaw) : [])
    
    const keywordsRaw = analysis.keywords || []
    const keywordsStr = Array.isArray(keywordsRaw) ? keywordsRaw.join(', ') : (typeof keywordsRaw === 'string' ? JSON.parse(keywordsRaw).join(', ') : 'N/A')

    if (titles.length === 0) {
      return NextResponse.json({ error: 'No blog post titles available' }, { status: 400 })
    }

    // اختيار عنوان (الأول للمستخدم العادي، أو عشوائي للـ Cron Job)
    const targetTitle = isCronJob ? titles[Math.floor(Math.random() * titles.length)] : titles[0]
    console.log(`🚀 Auto-Executing: Generating and publishing "${targetTitle}"`)

    // 4. توليد مقال ثنائي اللغة
    const prompt = `
      You are an expert SEO content writer AND a professional Arabic translator with 20+ years of experience.
      
      Title: ${targetTitle}
      Website URL: ${analysis.url}
      Business Niche: ${analysis.niche}
      Target Keywords: ${keywordsStr}
      
      CRITICAL REQUIREMENTS:
      1. Output MUST be pure HTML only. No markdown.
      2. Start with <h1> containing the exact title in English.
      3. IMPORTANT: Add this CSS at the very beginning to hide sidebar and widgets in WordPress:
         <style>
           .sidebar, .widget, .widget-area, #sidebar, #secondary, .aside, nav, .menu, .navigation, ul[class*="menu"], ol[class*="menu"] { display: none !important; }
           .entry-content { width: 100% !important; max-width: 100% !important; }
         </style>
      
      4. **ARABIC TRANSLATION QUALITY - NON-NEGOTIABLE:**
         - You MUST write PERFECT, FLUENT, PROFESSIONAL Arabic (Modern Standard Arabic / الفصحى).
         - Arabic text MUST be grammatically correct with proper syntax.
         - Translate MEANING, not word-for-word. Make it natural and readable.
         - CRITICAL: NEVER output placeholder text like "[ترجمة عربية]" or "[Arabic translation]". You MUST output the ACTUAL translated text.
      
      5. For content structure:
         - Write English paragraph first.
         - Then write HIGH-QUALITY Arabic translation IMMEDIATELY after in a separate <p> tag.
      
      6. English paragraphs:
         <p class="en-content" dir="ltr" lang="en" style="text-align: left; margin-bottom: 1.5em;">Your actual English text here</p>
      
      7. Arabic paragraphs:
         <p class="ar-content" dir="rtl" lang="ar" style="text-align: right; direction: rtl; unicode-bidi: embed; margin-bottom: 1em; padding: 15px; background: #f0f9ff; border-right: 4px solid #0d9488; font-family: 'Tahoma', 'Arial', sans-serif; line-height: 1.8;">Your actual Arabic translation here</p>
      
      8. Section titles:
         - English: <h2 style="text-align: left; margin-top: 2em; margin-bottom: 0.8em; color: #1f2937; font-size: 1.8em;">Your English Title</h2>
         - Arabic: <h2 style="text-align: right; direction: rtl; margin-top: 2em; margin-bottom: 0.8em; color: #1f2937; font-family: 'Tahoma', 'Arial', sans-serif; font-size: 1.8em;">Your actual Arabic title translation</h2>
      
      9. Bullet points:
         - English: <ul style="text-align: left; margin: 1em 0; padding-left: 2em;"><li>Your English item</li></ul>
         - Arabic: <ul style="text-align: right; direction: rtl; margin: 1em 0; padding-right: 2em; padding-left: 0;"><li>Your actual Arabic item translation</li></ul>
      
      10. Include engaging introduction, clear structure with <h2> and <h3>, and strong call-to-action.
      11. Naturally integrate the target keywords in BOTH languages.
      
      **NOW WRITE THE FULL ARTICLE WITH ACTUAL, PERFECT ARABIC TRANSLATIONS!**
    `

    const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 3500,
      }),
    })

    if (!aiResponse.ok) {
      throw new Error('Failed to generate article with AI')
    }

    const aiData = await aiResponse.json()
    let generatedHtml = aiData.choices[0].message.content.replace(/^```[a-z]*\n?|\n?```$/g, '').trim()

    // 5. توليد صورة مخصصة بالذكاء الاصطناعي (Pollinations.ai)
    let featuredImageId = null
    
    try {
      const imagePrompt = encodeURIComponent(`Professional high quality photography of ${analysis.niche}, related to ${targetTitle}, modern, bright lighting, 8k resolution, realistic, no text, no watermarks`)
      const imageUrl = `https://image.pollinations.ai/prompt/${imagePrompt}?width=1920&height=1080&nologo=true&seed=${Date.now()}`
      
      console.log('🖼️ Generating custom AI image...')
      
      const imageResponse = await fetch(imageUrl)
      if (imageResponse.ok) {
        const imageBlob = await imageResponse.blob()
        const formData = new FormData()
        formData.append('file', imageBlob, 'featured-image.jpg')
        formData.append('title', `Featured: ${targetTitle}`)

        const wpImageResponse = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64'),
          },
          body: formData,
        })

        if (wpImageResponse.ok) {
          const wpImageData = await wpImageResponse.json()
          featuredImageId = wpImageData.id
          console.log('✅ Featured image uploaded to WordPress ID:', featuredImageId)
        }
      }
    } catch (imgError) {
      console.warn('⚠️ Could not fetch/upload featured image, continuing without it:', imgError)
    }

    // 6. النشر المباشر في WordPress
    const wpPostData: any = {
      title: targetTitle,
      content: generatedHtml,
      status: 'publish',
    }

    if (featuredImageId) {
      wpPostData.featured_media = featuredImageId
    }

    const wpResponse = await fetch(`${WP_URL}/wp-json/wp/v2/posts`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wpPostData),
    })

    if (!wpResponse.ok) {
      const wpError = await wpResponse.json()
      console.error('WordPress Publish Error:', wpError)
      throw new Error('Failed to publish to WordPress')
    }

    const wpData = await wpResponse.json()
    const postUrl = wpData.link

    // 7. 🌟 ميزة جديدة: توليد منشور LinkedIn احترافي وحفظه
    console.log('📱 Generating LinkedIn Post...')
    const linkedinPrompt = `
      You are a LinkedIn Social Media Expert.
      Write a professional, engaging LinkedIn post based on this new blog article.
      
      Article Title: ${targetTitle}
      Article Niche: ${analysis.niche}
      Article URL: ${postUrl}
      
      Requirements:
      1. Start with a strong "Hook" (first 2 lines must grab attention).
      2. Summarize the key value of the article in 3-4 bullet points (use emojis like ✅, 🚀, 💡).
      3. Keep the tone professional yet conversational.
      4. End with a Call-to-Action (CTA) asking people to read the full article via the link.
      5. Add 3-5 relevant hashtags at the very end (e.g., #SEO #${analysis.niche.replace(/\s/g, '')} #Business).
      6. DO NOT include the URL inside the text body, put it at the very end after "Read more:".
      7. Output MUST be plain text only. No markdown formatting like **bold**.
    `

    let linkedinContent = ""
    let linkedinHashtags = ""

    try {
      const linkedinResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: GROQ_MODEL, messages: [{ role: 'user', content: linkedinPrompt }], temperature: 0.8, max_tokens: 500 }),
      })

      if (linkedinResponse.ok) {
        const linkedinData = await linkedinResponse.json()
        const rawPost = linkedinData.choices[0].message.content.replace(/^```[a-z]*\n?|\n?```$/g, '').trim()
        
        // فصل الهاشتاجات عن النص
        const hashtagRegex = /(#\w+\s*)+$/g
        const match = rawPost.match(hashtagRegex)
        if (match) {
          linkedinHashtags = match[0].trim()
          linkedinContent = rawPost.replace(hashtagRegex, '').trim()
        } else {
          linkedinContent = rawPost
        }

        // حفظ في قاعدة البيانات
        await supabaseAdmin.from('linkedin_posts').insert({
          user_id: targetUserId,
          article_id: analysis.id, // تم مطابقة النوع مع BIGINT
          post_content: linkedinContent,
          hashtags: linkedinHashtags,
          status: 'generated'
        })
        console.log('✅ LinkedIn post generated and saved!')
      } else {
        console.warn('⚠️ Failed to generate LinkedIn post')
      }
    } catch (linkedinError) {
      console.warn('⚠️ LinkedIn generation error:', linkedinError)
    }

    // 8. زيادة عداد استخدام التجربة المجانية
    if (subscriptionStatus === 'trial' && isTrialActive) {
      await supabaseAdmin
        .from('profiles')
        .update({ trial_articles_used: articlesUsed + 1 })
        .eq('id', targetUserId)
    }

    // 9. إرسال إيميل للعميل بعد النشر الناجح
    if (resend && CLIENT_EMAIL) {
      try {
        console.log(`📧 Sending email notification to ${CLIENT_EMAIL}`)
        
        await resend.emails.send({
          from: `SEOMind AI <${FROM_EMAIL}>`,
          to: CLIENT_EMAIL,
          subject: `✅ New Article & LinkedIn Post Published: ${targetTitle}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #0d9488;">🎉 Content Published Successfully!</h2>
              <p>Dear Valued Client,</p>
              <p>A new SEO-optimized article and a LinkedIn post have been generated for your website:</p>
              
              <div style="background: #f0fdfa; border-left: 4px solid #0d9488; padding: 20px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1f2937;">${targetTitle}</h3>
                <p style="color: #6b7280; margin-bottom: 0;">
                  <strong>Business Niche:</strong> ${analysis.niche}<br>
                  <strong>Target Location:</strong> ${analysis.location}<br>
                  <strong>Keywords:</strong> ${keywordsStr}
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${postUrl}" 
                   style="display: inline-block; background: #0d9488; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  View Published Article →
                </a>
              </div>

              <div style="background: #0077b5; color: white; padding: 15px; border-radius: 6px; margin-top: 20px;">
                <h4 style="margin-top: 0;">📱 LinkedIn Post Generated</h4>
                <p style="font-size: 14px; margin-bottom: 0;">A professional LinkedIn post has been generated and saved to your dashboard. You can copy and paste it directly to your company page to maximize reach!</p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Powered by SEOMind AI | Automated SEO Content Generation
              </p>
            </div>
          `,
        })
        console.log('✅ Email sent successfully!')
      } catch (emailError) {
        console.error('❌ Failed to send email:', emailError)
      }
    }

    const remainingTrials = (subscriptionStatus === 'trial' && isTrialActive) ? maxTrial - (articlesUsed + 1) : 'unlimited'

    return NextResponse.json({
      success: true,
      message: 'Article and LinkedIn post generated successfully!',
      postUrl: postUrl,
      title: targetTitle,
      hasFeaturedImage: !!featuredImageId,
      emailSent: !!(resend && CLIENT_EMAIL),
      trialRemaining: remainingTrials,
      linkedinPostGenerated: true
    })

  } catch (error: any) {
    console.error('❌ Auto-Execute Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}