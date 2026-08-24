import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { Resend } from 'resend'

// ✅ الحل الجذري: تهيئة Resend بشكل آمن لمنع انهيار الـ Build لو المفتاح غير موجود
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null

export async function GET(request: NextRequest) {
  // 1. التحقق من أن الطلب قادم من المجدول (Cron) وليس من شخص عادي
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // 2. جلب التحليلات الجاهزة للنشر واللي لسه ماتنشرتش على ووردبريس
    const { data: analyses, error } = await supabaseAdmin
      .from('analyses')
      .select('*')
      .eq('auto_execution_ready', true)
      .eq('wordpress_published', false)
      .limit(3)

    if (error || !analyses || analyses.length === 0) {
      return NextResponse.json({ message: 'No pending analyses to publish', count: 0 })
    }

    let publishedCount = 0
    const wpUrl = process.env.WORDPRESS_URL
    const username = process.env.WORDPRESS_USERNAME
    const password = process.env.WORDPRESS_APP_PASSWORD?.replace(/\s/g, '')
    const credentials = Buffer.from(`${username}:${password}`).toString('base64')

    // 3. الدوران على كل تحليل ونشره
    for (const analysis of analyses) {
      const title = analysis.blog_post_titles?.[0] || `تحليل SEO شامل لـ ${analysis.niche}`
      
      const content = `
        <h2>تحليل SEO شامل لـ ${analysis.niche}</h2>
        <p><strong>الموقع المستهدف:</strong> ${analysis.location}</p>
        <p><strong>نتيجة التحليل:</strong> ${analysis.seo_score}/100</p>
        
        ${analysis.issues?.length ? `<h3>⚠️ المشاكل المكتشفة:</h3><ul>${analysis.issues.map((i: string) => `<li>${i}</li>`).join('')}</ul>` : ''}
        ${analysis.recommendations?.length ? `<h3>✅ التوصيات:</h3><ul>${analysis.recommendations.map((r: string) => `<li>${r}</li>`).join('')}</ul>` : ''}
        ${analysis.keywords?.length ? `<h3>🎯 الكلمات المفتاحية:</h3><p>${analysis.keywords.join(', ')}</p>` : ''}
        
        <p><em>تم إنشاء ونشر هذا المحتوى أوتوماتيكياً بواسطة SEO Mind AI 🤖</em></p>
      `

      // النشر على WordPress
      const wpResponse = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          content: content,
          status: 'publish',
        }),
      })

      if (wpResponse.ok) {
        const wpData = await wpResponse.json()
        
        // تحديث حالة التحليل في قاعدة البيانات إلى "تم النشر"
        await supabaseAdmin
          .from('analyses')
          .update({ 
            wordpress_published: true,
            wordpress_url: wpData.link,
            status: 'published'
          })
          .eq('id', analysis.id)

        publishedCount++
      }
    }

    // 4. إرسال إيميل للإشعار (مع حماية كاملة ضد انهيار الـ Build)
    if (publishedCount > 0 && process.env.CLIENT_EMAIL && resend) {
      try {
        await resend.emails.send({
          from: 'SEO Mind AI <onboarding@resend.dev>',
          to: [process.env.CLIENT_EMAIL],
          subject: `✅ تم نشر ${publishedCount} مقال جديد على WordPress أوتوماتيكياً`,
          html: `<p>مرحباً،<br>قام النظام بنشر ${publishedCount} مقال/تحليل جديد بنجاح على موقع مغاسلنا اليوم.</p>`
        })
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError)
      }
    } else if (publishedCount > 0 && !resend) {
      console.warn('⚠️ Resend API key is missing. Email notification skipped (Build safe).')
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully published ${publishedCount} posts`,
      count: publishedCount 
    })

  } catch (error: any) {
    console.error('❌ Auto-publish Cron Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}