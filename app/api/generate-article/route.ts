import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { niche, url, keywords, content_strategy } = await request.json()

    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      console.error('❌ Groq API key not configured in .env.local')
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 })
    }

    // ✅ تم تحسين الـ Prompt لمنع الأقواس الفارغة وأرقام الهواتف الوهمية
    const prompt = `
      You are an expert SEO content writer and copywriter. Write a comprehensive, engaging, and SEO-optimized blog post (approximately 500-600 words) in pure HTML format.
      
      Website URL: ${url}
      Business Niche: ${niche}
      Target Keywords to include naturally: ${keywords ? keywords.join(', ') : 'N/A'}
      Content Strategy to follow: ${content_strategy}

      Strict Requirements:
      1. Output MUST be pure HTML only (use <h1>, <h2>, <h3>, <p>, <ul>, <li>, <strong>). Do NOT wrap it in markdown code blocks.
      2. Start with a catchy <h1> title.
      3. NEVER use placeholders like "[Your Company Name]". Instead, use "Our Clinic", "We", or derive a professional name from the Website URL.
      4. Do NOT invent fake phone numbers or emails in the CTA. Instead, use a generic CTA like "Contact us through our website at ${url}".
      5. Include an engaging introduction.
      6. Use <h2> and <h3> for clear structure and readability.
      7. Naturally integrate the target keywords without keyword stuffing.
      8. End with a strong, natural call-to-action (CTA) paragraph.
    `

    console.log('🔄 Sending request to Groq API with model: llama-3.1-8b-instant...')
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // ✅ هذا النموذج هو الأحدث والأكثر استقراراً وتوفراً حالياً على Groq
        model: 'llama-3.1-8b-instant', 
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error('❌ Groq API Error Response:', JSON.stringify(responseData, null, 2))
      return NextResponse.json({ 
        error: 'Failed to generate article', 
        details: responseData.error?.message || 'Unknown Groq error' 
      }, { status: response.status })
    }

    let generatedHtml = responseData.choices[0].message.content

    // تنظيف المخرجات من أي علامات markdown زائدة
    generatedHtml = generatedHtml.replace(/^```html\s*|\s*```$/g, '').trim()

    console.log('✅ Article generated successfully!')
    return NextResponse.json({ success: true, article: generatedHtml })

  } catch (error: any) {
    console.error('❌ Generate Article Critical Error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}