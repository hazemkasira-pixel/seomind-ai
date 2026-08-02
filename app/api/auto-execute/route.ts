import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_MODEL = 'llama-3.1-8b-instant'
const WP_URL = process.env.WORDPRESS_URL
const WP_USERNAME = process.env.WORDPRESS_USERNAME
const WP_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { analysisId } = await request.json()

    // 1. جلب بيانات التحليل
    const { data: analysis, error: dbError } = await supabaseAdmin
      .from('analyses')
      .select('*')
      .eq('id', analysisId)
      .eq('user_id', user.id)
      .single()

    if (dbError || !analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
    }

    const titles = analysis.blog_post_titles || []
    if (titles.length === 0) {
      return NextResponse.json({ error: 'No blog post titles available' }, { status: 400 })
    }

    // نأخذ أول عنوان مقترح للتنفيذ التلقائي (لتجنب مهلة انتظار السيرفر)
    const targetTitle = titles[0]

    console.log(`🚀 Auto-Executing: Generating and publishing "${targetTitle}"`)

    // 2. توليد المقال بالذكاء الاصطناعي
    const prompt = `
      You are an expert SEO content writer. Write a comprehensive, engaging, and SEO-optimized blog post (approximately 600-800 words) in pure HTML format.
      
      Title: ${targetTitle}
      Website URL: ${analysis.url}
      Business Niche: ${analysis.niche}
      Target Keywords: ${analysis.keywords ? analysis.keywords.join(', ') : 'N/A'}
      
      Requirements:
      1. Output MUST be pure HTML only (use <h1>, <h2>, <h3>, <p>, <ul>, <li>, <strong>). No markdown.
      2. Start with the exact title provided as an <h1>.
      3. Include an engaging introduction, clear structure with <h2> and <h3>, and a strong call-to-action at the end.
      4. Naturally integrate the target keywords.
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
        max_tokens: 2000,
      }),
    })

    if (!aiResponse.ok) {
      throw new Error('Failed to generate article with AI')
    }

    const aiData = await aiResponse.json()
    let generatedHtml = aiData.choices[0].message.content.replace(/^```html\s*|\s*```$/g, '').trim()

    // 3. النشر على WordPress
    const wpResponse = await fetch(`${WP_URL}/wp-json/wp/v2/posts`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: targetTitle,
        content: generatedHtml,
        status: 'publish',
      }),
    })

    if (!wpResponse.ok) {
      const wpError = await wpResponse.json()
      console.error('WordPress Publish Error:', wpError)
      throw new Error('Failed to publish to WordPress')
    }

    const wpData = await wpResponse.json()

    return NextResponse.json({
      success: true,
      message: 'Article generated and published successfully!',
      postUrl: wpData.link,
      title: targetTitle
    })

  } catch (error: any) {
    console.error('❌ Auto-Execute Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}