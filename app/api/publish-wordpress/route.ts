import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    // 1. التحقق من أن المستخدم مسجل دخول
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to publish.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { analysisId, title, content } = body

    const wpUrl = process.env.WORDPRESS_URL
    const username = process.env.WORDPRESS_USERNAME
    const password = process.env.WORDPRESS_APP_PASSWORD?.replace(/\s/g, '')

    if (!wpUrl || !username || !password) {
      return NextResponse.json(
        { error: 'WordPress credentials not configured' },
        { status: 500 }
      )
    }

    let finalTitle = title
    let finalContent = content

    // ✅ إذا تم إرسال analysisId، نقوم بجلب البيانات وتوليد المحتوى تلقائياً
    if (analysisId && (!finalTitle || !finalContent)) {
      const { data: analysis, error } = await supabaseAdmin
        .from('analyses')
        .select('*')
        .eq('id', analysisId)
        .single()

      if (error || !analysis) {
        return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
      }

      // توليد العنوان والمحتوى من بيانات التحليل
      finalTitle = analysis.blog_post_titles?.[0] || `SEO Analysis Report for ${analysis.niche}`
      
      finalContent = `
        <h2>تحليل SEO شامل لـ ${analysis.niche}</h2>
        <p><strong>الموقع:</strong> ${analysis.location}</p>
        <p><strong>النتيجة:</strong> ${analysis.seo_score}/100</p>
        
        ${analysis.issues && analysis.issues.length > 0 ? `<h3>⚠️ المشاكل المكتشفة:</h3><ul>${analysis.issues.map((i: string) => `<li>${i}</li>`).join('')}</ul>` : ''}
        
        ${analysis.recommendations && analysis.recommendations.length > 0 ? `<h3>✅ التوصيات:</h3><ul>${analysis.recommendations.map((r: string) => `<li>${r}</li>`).join('')}</ul>` : ''}
        
        ${analysis.keywords && analysis.keywords.length > 0 ? `<h3>🎯 الكلمات المفتاحية المقترحة:</h3><p>${analysis.keywords.join(', ')}</p>` : ''}
        
        ${analysis.thirty_day_plan && analysis.thirty_day_plan.length > 0 ? `<h3>📅 خطة العمل (30 يوم):</h3><ol>${analysis.thirty_day_plan.map((p: string, idx: number) => `<li><strong>الأسبوع ${idx + 1}:</strong> ${p}</li>`).join('')}</ol>` : ''}
        
        <p><em>تم إنشاء هذا التقرير تلقائياً بواسطة SEO Mind AI</em></p>
      `
    }

    if (!finalTitle || !finalContent) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // إنشاء Basic Auth Header
    const credentials = Buffer.from(`${username}:${password}`).toString('base64')

    const response = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: finalTitle,
        content: finalContent,
        status: 'publish', // غيّر إلى 'draft' إذا أردت مراجعته قبل النشر
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('WordPress API Error:', errorData)
      return NextResponse.json(
        { error: 'Failed to publish to WordPress', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // ✅ تحديث حالة النشر في قاعدة البيانات
    if (analysisId) {
      await supabaseAdmin
        .from('analyses')
        .update({ 
          wordpress_url: data.link, 
          wordpress_published: true 
        })
        .eq('id', analysisId)
    }

    return NextResponse.json({ 
      success: true, 
      postUrl: data.link,
      message: 'Published to WordPress successfully' 
    })

  } catch (error: any) {
    console.error('Publish to WordPress error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}