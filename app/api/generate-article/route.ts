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
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 })
    }

    const prompt = `
      You are an expert SEO content writer. Write a comprehensive, engaging, and SEO-optimized blog post (approximately 600-800 words) in HTML format.
      
      Website URL: ${url}
      Business Niche: ${niche}
      Target Keywords to include naturally: ${keywords ? keywords.join(', ') : 'N/A'}
      Content Strategy to follow: ${content_strategy}

      Requirements:
      1. Output MUST be pure HTML only (use <h2>, <h3>, <p>, <ul>, <li>, <strong>). Do NOT wrap it in markdown code blocks (no \`\`\`html).
      2. Start with a catchy <h1> title.
      3. Include an engaging introduction.
      4. Use <h2> and <h3> for clear structure and readability.
      5. Naturally integrate the target keywords.
      6. End with a strong call-to-action (CTA) paragraph.
    `

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192', // نموذج قوي وسريع جداً
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Groq API Error:', errorData)
      return NextResponse.json({ error: 'Failed to generate article' }, { status: 500 })
    }

    const data = await response.json()
    let generatedHtml = data.choices[0].message.content

    // تنظيف المخرجات من أي علامات markdown زائدة
    generatedHtml = generatedHtml.replace(/^```html\s*|\s*```$/g, '').trim()

    return NextResponse.json({ success: true, article: generatedHtml })

  } catch (error) {
    console.error('Generate Article Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}