'use client'

import React, { createContext, useContext, ReactNode } from 'react'

// ✅ بيانات الترجمة المدمجة (عشان نضمن إنها تشتغل)
const translations = {
  hero: {
    badge: 'AI-Powered SEO Analysis',
    title1: 'Dominate Local SEO',
    title2: 'with AI Intelligence',
    subtitle: 'Get instant, actionable SEO insights powered by advanced AI. Analyze, optimize, and dominate your local market.',
    form: {
      error: 'Please fill in all required fields'
    },
    features: {
      instant: 'Instant Analysis',
      ai: 'AI-Powered',
      local: 'Local Focus'
    },
    trusted: 'Trusted by SEO professionals worldwide'
  },
  features: {
    title: 'Powerful Features',
    subtitle: 'Everything you need to rank higher in local search',
    items: {
      aiPowered: {
        title: 'AI-Powered Analysis',
        desc: 'Advanced AI algorithms provide deep insights into your SEO performance'
      },
      localSeo: {
        title: 'Local SEO Focus',
        desc: 'Dominate your local market with city-specific optimization strategies'
      },
      competitor: {
        title: 'Competitor Analysis',
        desc: 'Discover your top competitors and learn how to outrank them'
      }
    }
  },
  howItWorks: {
    title: 'How It Works',
    subtitle: 'Get started in 3 simple steps',
    steps: {
      1: { title: 'Enter Your Details', desc: 'Provide your website URL and target location' },
      2: { title: 'AI Analysis', desc: 'Our AI analyzes your SEO performance' },
      3: { title: 'Get Actionable Insights', desc: 'Receive detailed recommendations to improve' }
    }
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know',
    items: [
      { q: 'How accurate is the analysis?', a: 'Our AI uses advanced algorithms to provide accurate, actionable insights.' },
      { q: 'Can I use this for multiple websites?', a: 'Yes! You can analyze as many websites as you need.' },
      { q: 'How long does it take?', a: 'Analysis typically completes in under 60 seconds.' }
    ]
  },
  stats: {
    items: [
      { value: '10K+', label: 'Websites Analyzed' },
      { value: '98%', label: 'Accuracy Rate' },
      { value: '24/7', label: 'AI Available' },
      { value: '60s', label: 'Avg. Analysis Time' }
    ]
  }
}

const I18nContext = createContext<{
  language: 'en'
  t: (key: string) => any
}>({
  language: 'en',
  t: () => '',
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const t = (key: string): any => {
    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key
      }
    }
    
    return value
  }

  return (
    <I18nContext.Provider value={{ language: 'en', t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider')
  }
  return context
}