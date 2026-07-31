import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    const body = await request.json()
    const { url, niche, location } = body

    // 1. التحقق من البيانات والمستخدم
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      )
    }

    if (!url || !niche || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: url, niche, location' },
        { status: 400 }
      )
    }

    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Groq API key is not configured' },
        { status: 500 }
      )
    }

    // استخراج اسم المدينة فقط من الموقع لتحسين دقة الكلمات المفتاحية (مثال: "Al Ain" من "Al Ain, Abu Dhabi, UAE")
    const cityOnly = location.split(',')[0].trim()

    // 2. بناء الـ Prompt الذكي (Local vs Global SEO)
    const seoPrompt = `
      You are an expert SEO analyst with 20 years of experience, specializing in both hyper-local and global SEO strategies.
      Analyze the following website details and provide a comprehensive, actionable SEO report in strict JSON format.
      
      Website URL: ${url}
      Business Niche: ${niche}
      Target Location Scope: ${location}
      Primary City/Area Focus: ${cityOnly}

      CRITICAL INSTRUCTIONS BASED ON LOCATION SCOPE:
      - If the location is a specific city or region (e.g., "Al Ain", "Dubai"), focus HEAVILY on Local SEO: Google Business Profile optimization, "near me" keywords, local citations, and LocalBusiness schema markup.
      - If the location is "Country-wide" or "Global", focus on broader domain authority, national/international SEO, and high-volume generic keywords.

      Provide the JSON response with the following exact structure (no markdown, no extra text, valid JSON only):
      {
        "seoScore": 85,
        "issues": ["Missing local business schema", "Slow page speed", "Lack of localized landing pages"],
        "recommendations": ["Add LocalBusiness schema markup", "Create location-specific landing pages for ${cityOnly}", "Optimize Google Business Profile"],
        "keywords": ["best ${niche} in ${cityOnly}", "${niche} near me in ${cityOnly}", "top rated ${niche} ${cityOnly}", "${niche} services ${location}"],
        "competitorInsights": "Analyze the competitive landscape specifically for ${location}. Mention the importance of outranking local competitors in ${cityOnly}.",
        "contentStrategy": "Provide a content strategy tailored for ${location}. Suggest 3 specific, high-converting blog post titles targeting customers in ${cityOnly}."
      }
    `

    // 3. استدعاء Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a professional SEO analyst. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: seoPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Groq API Error:', errorText)
      return NextResponse.json(
        { error: 'Failed to connect to AI service' },
        { status: 500 }
      )
    }

    const aiResponse = await response.json()
    const content = aiResponse.choices?.[0]?.message?.content || ''

    // 4. استخراج JSON
    let analysisData
    try {
      const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim()
      analysisData = JSON.parse(cleanJson)
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      analysisData = {
        seoScore: 70,
        issues: ['Could not parse AI response'],
        recommendations: ['Review manually'],
        keywords: [niche, location],
        competitorInsights: `Analysis pending for ${location}.`,
        contentStrategy: `Focus on quality content for ${cityOnly}.`
      }
    }

    // 5. حفظ في Supabase باستخدام supabaseAdmin (يتجاوز RLS بأمان لأن الـ Route محمي بـ Clerk)
    const userId = user.id

    const { data: savedAnalysis, error: dbError } = await supabaseAdmin
      .from('analyses')
      .insert({
        user_id: userId,
        url,
        niche,
        location,
        seo_score: analysisData.seoScore || 0,
        issues: analysisData.issues || [],
        recommendations: analysisData.recommendations || [],
        keywords: analysisData.keywords || [],
        competitor_insights: analysisData.competitorInsights || '',
        content_strategy: analysisData.contentStrategy || '',
        status: 'completed',
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database Error:', dbError)
    }

    // 6. إرجاع النتيجة باستخدام الـ ID الحقيقي من قاعدة البيانات
    return NextResponse.json({
      success: true,
      analysisId: savedAnalysis?.id || `analysis_${Date.now()}`,
      message: 'SEO Analysis completed successfully',
      data: {
        url,
        niche,
        location,
        status: 'completed',
        ...analysisData,
        analyzedAt: new Date().toISOString(),
      },
    })

  } catch (error) {
    console.error('Server Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}