import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const GROQ_API_KEY = process.env.GROQ_API_KEY
// ✅ استخدام الموديل المتاح في حسابك حالياً
const GROQ_MODEL = 'groq/compound'

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    const body = await request.json()
    const { url, niche, location, competitorUrl, coverageCities } = body

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!url || !niche || !location) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    if (!GROQ_API_KEY) return NextResponse.json({ error: 'API key missing' }, { status: 500 })

    const cityOnly = location.split(',')[0].trim()
    const geoScope = `LOCAL - ${cityOnly}, ${location}`

    const seoPrompt = `
      You are an AI MARKETING MANAGER. Analyze and strategize.
      WEBSITE: ${url}
      NICHE: ${niche}
      LOCATION: ${geoScope}
      ${coverageCities && coverageCities.length > 0 ? `COVERAGE CITIES: ${coverageCities.join(', ')}` : ''}

      Respond with valid JSON ONLY (no markdown, no extra text):
      {
        "seoScore": 75,
        "geoScope": "${geoScope}",
        "discoveredCompetitors": [{"name": "Local Competitor", "domain": "competitor.com", "location": "${cityOnly}", "strength": "Good local presence", "weakness": "Poor website speed"}],
        "recommendedTarget": "Local Competitor",
        "issues": ["Slow loading speed", "Missing local schema", "Thin content"],
        "recommendations": ["Optimize images", "Add LocalBusiness schema", "Create location pages"],
        "keywords": ["${niche} in ${cityOnly}", "best ${niche} ${cityOnly}"],
        "thirtyDayPlan": ["Week 1: Technical fixes", "Week 2: Local SEO", "Week 3: Content", "Week 4: Citations"],
        "blogPostTitles": ["Best ${niche} in ${cityOnly}", "Guide to ${niche} in ${cityOnly}"],
        "contentStrategy": "Focus on hyper-local content for ${cityOnly}.",
        "competitorInsights": "Competitors lack strong local SEO.",
        "autoExecutionReady": true,
        "nextAction": "Publish local blog posts and optimize Google Business Profile"
      }
    `

    console.log(`🤖 Analyzing ${url} with ${GROQ_MODEL}...`)

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: 'You are an AI marketing manager. Respond with valid JSON ONLY.' },
          { role: 'user', content: seoPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Groq API Error:', errorText)
      return NextResponse.json({ error: 'فشل الاتصال بخدمة الذكاء الاصطناعي', details: errorText }, { status: 500 })
    }

    const aiResponse = await response.json()
    const content = aiResponse.choices?.[0]?.message?.content || ''

    let analysisData
    try {
      const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim()
      analysisData = JSON.parse(cleanJson)
      console.log('✅ Analysis completed!')
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError)
      analysisData = {
        seoScore: 70, geoScope: geoScope, discoveredCompetitors: [], recommendedTarget: 'Pending',
        issues: ['Parse error'], recommendations: ['Review manually'], keywords: [niche],
        thirtyDayPlan: ['Week 1-4: Focus on content'], blogPostTitles: ['Best guide'],
        contentStrategy: 'Focus on quality', competitorInsights: 'Pending', autoExecutionReady: false, nextAction: 'Manual review'
      }
    }

    const userId = user.id
    const { data: savedAnalysis, error: dbError } = await supabaseAdmin
      .from('analyses')
      .insert({
        user_id: userId, url, niche, location, competitor_url: competitorUrl || null,
        seo_score: analysisData.seoScore || 0, issues: analysisData.issues || [],
        recommendations: analysisData.recommendations || [], keywords: analysisData.keywords || [],
        competitor_insights: analysisData.competitorInsights || '', content_strategy: analysisData.contentStrategy || '',
        discovered_competitors: analysisData.discoveredCompetitors || [], recommended_target: analysisData.recommendedTarget || '',
        thirty_day_plan: analysisData.thirtyDayPlan || [], blog_post_titles: analysisData.blogPostTitles || [],
        geo_scope: analysisData.geoScope || geoScope, auto_execution_ready: analysisData.autoExecutionReady || false,
        next_action: analysisData.nextAction || '', status: 'completed',
      })
      .select()
      .single()

    if (dbError) console.error(' Database Error:', dbError)

    return NextResponse.json({
      success: true,
      analysisId: savedAnalysis?.id || `analysis_${Date.now()}`,
      data: { url, niche, location, status: 'completed', ...analysisData, analyzedAt: new Date().toISOString() },
    })

  } catch (error: any) {
    console.error('❌ Server Error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}