import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_MODEL = 'llama-3.1-8b-instant'

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    const body = await request.json()
    const { url, niche, location, competitorUrl } = body

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
      console.error('❌ GROQ_API_KEY is missing from .env.local')
      return NextResponse.json(
        { error: 'Groq API key is not configured' },
        { status: 500 }
      )
    }

    const cityOnly = location.split(',')[0].trim()
    
    // ✅ تحديد نوع الاستهداف (محلي vs عالمي)
    const isGlobalTarget = 
      location.toLowerCase().includes('global') || 
      location.toLowerCase().includes('worldwide') ||
      location.toLowerCase().includes('عالمي') ||
      location.toLowerCase().includes('جميع أنحاء')

    const geoScope = isGlobalTarget ? 'GLOBAL/WORLDWIDE' : `LOCAL - ${cityOnly}, ${location}`

    // ✅ المرحلة 1: البحث التلقائي عن المنافسين مع مراعاة النطاق الجغرافي
    let competitorContext = ''

    if (competitorUrl) {
      competitorContext = `
        The user provided a direct competitor: ${competitorUrl}.
        IMPORTANT: Verify that this competitor operates in the target geographic scope: ${geoScope}.
        Analyze this specific competitor and find ways to outrank them in the ${geoScope} market.
      `
    } else {
      if (isGlobalTarget) {
        competitorContext = `
          STEP 1 - AUTO DISCOVERY (GLOBAL SCOPE):
          Since the target is GLOBAL/WORLDWIDE, identify 3-5 MAJOR INTERNATIONAL competitors in the "${niche}" industry.
          For each competitor, provide:
          - Their domain (e.g., major international brands in ${niche})
          - Their global strengths (international presence, brand authority, backlink profile)
          - Their global weaknesses (gaps in content, underserved markets, technical issues)
          STEP 2 - STRATEGY SELECTION: Choose the competitor with the most exploitable weaknesses.
          STEP 3 - WINNING GLOBAL STRATEGY: Provide a strategy to compete on an international level.
        `
      } else {
        competitorContext = `
          STEP 1 - AUTO DISCOVERY (LOCAL SCOPE - CRITICAL):
          Since the target is LOCAL (${cityOnly}, ${location}), you MUST identify 3-5 competitors that are SPECIFICALLY based in or serving ${cityOnly} and the surrounding ${location} area.
          CRITICAL RULES:
          - DO NOT suggest international or national competitors unless they have a strong local presence in ${cityOnly}.
          - Focus on businesses that appear in local search results for "${niche} in ${cityOnly}".
          For each competitor, provide:
          - Their likely domain (must be relevant to ${cityOnly}/${location})
          - Their local strengths (Google Business Profile, local reviews, local backlinks)
          - Their local weaknesses (poor local SEO, outdated content, weak local presence)
          STEP 2 - STRATEGY SELECTION: Choose the LOCAL competitor that is easiest to outrank in ${cityOnly} search results.
          STEP 3 - WINNING LOCAL STRATEGY: Provide a hyper-local strategy to dominate ${cityOnly} search results within 30-60 days.
        `
      }
    }

    // ✅ المرحلة 2: بناء الـ Prompt الذكي المتكامل
    const seoPrompt = `
      You are an AUTONOMOUS AI MARKETING MANAGER with 20 years of SEO experience.
      Your job is to analyze, strategize, and EXECUTE a complete SEO plan to dominate the market.
      
      CLIENT WEBSITE: ${url}
      BUSINESS NICHE: ${niche}
      TARGET GEOGRAPHIC SCOPE: ${geoScope}
      PRIMARY CITY: ${cityOnly}

      ${competitorContext}

      CRITICAL INSTRUCTIONS BASED ON GEO SCOPE:
      ${isGlobalTarget ? `
        - Focus on INTERNATIONAL SEO: hreflang tags, multi-language support, global backlinks, international domain authority.
        - Target high-volume global keywords with commercial intent.
      ` : `
        - Focus HEAVILY on LOCAL SEO: Google Business Profile optimization, "near me" keywords, local citations, LocalBusiness schema markup.
        - Target location-specific keywords like "${niche} in ${cityOnly}", "best ${niche} ${cityOnly}".
      `}

      Provide the JSON response with the following exact structure (no markdown, no extra text, valid JSON only):
      {
        "seoScore": 75,
        "geoScope": "${geoScope}",
        "discoveredCompetitors": [
          { 
            "name": "Competitor Name", 
            "domain": "competitor.com", 
            "location": "${isGlobalTarget ? 'International' : cityOnly + ', ' + location}",
            "strength": "Their main strength", 
            "weakness": "Their exploitable weakness" 
          }
        ],
        "recommendedTarget": "Competitor Name - easiest to outrank due to [specific reason]",
        "issues": ["Issue 1", "Issue 2", "Issue 3"],
        "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
        "keywords": [
          "${isGlobalTarget ? `best ${niche} worldwide` : `best ${niche} in ${cityOnly}`}",
          "${isGlobalTarget ? `${niche} services global` : `${niche} near me ${cityOnly}`}",
          "${isGlobalTarget ? `top ${niche} international` : `top rated ${niche} ${cityOnly}`}"
        ],
        "thirtyDayPlan": [
          "Week 1: Fix technical SEO issues",
          "Week 2: Optimize ${isGlobalTarget ? 'international SEO (hreflang, multi-language)' : 'Google Business Profile and get 5 local reviews'}",
          "Week 3: Publish 2 blog posts targeting ${isGlobalTarget ? 'global' : 'local'} keywords",
          "Week 4: Build ${isGlobalTarget ? 'international backlinks' : '10 local citations in ' + cityOnly}"
        ],
        "blogPostTitles": [
          "${isGlobalTarget ? `The Ultimate Global Guide to ${niche} in 2026` : `The Ultimate Guide to ${niche} in ${cityOnly}: What You Need to Know in 2026`}",
          "${isGlobalTarget ? `Top 10 ${niche} Providers Worldwide: Expert Reviews` : `Top 10 ${niche} in ${cityOnly}: Honest Local Reviews`}",
          "${isGlobalTarget ? `How to Choose the Best ${niche}: A Global Buyer's Guide` : `How to Choose the Best ${niche} in ${cityOnly}: A Local's Guide`}"
        ],
        "contentStrategy": "${isGlobalTarget ? `Focus on comprehensive, authoritative content that competes internationally.` : `Focus on hyper-local content targeting ${cityOnly}. Create location-specific landing pages and blog posts.`}",
        "competitorInsights": "${isGlobalTarget ? `Global competitors dominate through brand authority. We can compete by creating more comprehensive, up-to-date content.` : `Local competitors have weak local SEO presence. We can outrank them by focusing on local signals, Google Business Profile, and local content.`}",
        "autoExecutionReady": true,
        "nextAction": "Generate and publish 3 ${isGlobalTarget ? 'international' : 'local'} blog posts, then optimize ${isGlobalTarget ? 'hreflang tags' : 'Google Business Profile'}"
      }
    `

    console.log(`🤖 AI Marketing Agent analyzing ${url} in ${geoScope}...`)

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: 'You are an autonomous AI marketing manager. Always respond with valid JSON only.' },
          { role: 'user', content: seoPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Groq API Error:', errorText)
      return NextResponse.json(
        { error: 'Failed to connect to AI service', details: errorText },
        { status: 500 }
      )
    }

    const aiResponse = await response.json()
    const content = aiResponse.choices?.[0]?.message?.content || ''

    let analysisData
    try {
      const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim()
      analysisData = JSON.parse(cleanJson)
      console.log('✅ AI Marketing Agent analysis completed!')
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError)
      analysisData = {
        seoScore: 70,
        geoScope: geoScope,
        discoveredCompetitors: [],
        recommendedTarget: 'Analysis pending',
        issues: ['Could not parse AI response'],
        recommendations: ['Review manually'],
        keywords: [niche, location],
        thirtyDayPlan: ['Week 1-4: Focus on quality content'],
        blogPostTitles: ['Best ' + niche + ' guide'],
        contentStrategy: 'Focus on quality content',
        competitorInsights: competitorUrl ? `Analysis pending for competitor: ${competitorUrl}` : `Auto-discovery pending for ${niche} in ${geoScope}`,
        autoExecutionReady: false,
        nextAction: 'Manual review required'
      }
    }

    // ✅ حفظ في Supabase مع إضافة الأعمدة الجديدة
    const userId = user.id

    const { data: savedAnalysis, error: dbError } = await supabaseAdmin
      .from('analyses')
      .insert({
        user_id: userId,
        url,
        niche,
        location,
        competitor_url: competitorUrl || null,
        seo_score: analysisData.seoScore || 0,
        issues: analysisData.issues || [],
        recommendations: analysisData.recommendations || [],
        keywords: analysisData.keywords || [],
        competitor_insights: analysisData.competitorInsights || '',
        content_strategy: analysisData.contentStrategy || '',
        // ✅ الأعمدة الجديدة لمدير التسويق AI
        discovered_competitors: analysisData.discoveredCompetitors || [],
        recommended_target: analysisData.recommendedTarget || '',
        thirty_day_plan: analysisData.thirtyDayPlan || [],
        blog_post_titles: analysisData.blogPostTitles || [],
        geo_scope: analysisData.geoScope || geoScope,
        auto_execution_ready: analysisData.autoExecutionReady || false,
        next_action: analysisData.nextAction || '',
        status: 'completed',
      })
      .select()
      .single()

    if (dbError) {
      console.error('❌ Database Error:', dbError)
    }

    return NextResponse.json({
      success: true,
      analysisId: savedAnalysis?.id || `analysis_${Date.now()}`,
      message: 'AI Marketing Agent analysis completed successfully',
      data: {
        url,
        niche,
        location,
        competitorUrl: competitorUrl || null,
        status: 'completed',
        ...analysisData,
        analyzedAt: new Date().toISOString(),
      },
    })

  } catch (error: any) {
    console.error('❌ Server Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}