'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'What is SEOMind AI and how does it work?',
    answer: 'SEOMind AI is an automated SEO content platform. You just enter your website URL, and our AI analyzes your niche, researches keywords, writes optimized articles, and can even auto-publish them directly to your site.',
  },
  {
    question: 'How does the 30-day free trial work?',
    answer: 'You get full access to the Starter plan features for 30 days. No credit card is required to start. At the end of the trial, you can choose to upgrade to a paid plan or your account will simply pause.',
  },
  {
    question: 'Is the AI-generated content actually SEO-optimized?',
    answer: 'Yes. Unlike generic AI writers, SEOMind AI uses real-time SERP data, competitor analysis, and semantic SEO principles to ensure every article is structured to rank on Google.',
  },
  {
    question: 'Can I cancel my subscription at any time?',
    answer: 'Absolutely. There are no long-term contracts. You can cancel your subscription from your dashboard at any time, and you will keep access until the end of your current billing cycle.',
  },
  {
    question: 'Does SEOMind AI support multiple languages?',
    answer: 'Yes! We support over 30 languages, including Arabic, English, Spanish, French, and German, with native-level fluency and region-specific SEO optimization.',
  },
  {
    question: 'How is this different from using ChatGPT or Jasper?',
    answer: 'Generic AI tools just write text. SEOMind AI is a complete SEO workflow: it handles keyword research, content structuring, internal linking suggestions, competitor tracking, and direct CMS publishing.',
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-16 text-center">
        <span className="inline-flex items-center rounded-full border border-teal/40 bg-teal/5 px-4 py-1.5 text-sm font-medium text-teal">
          FAQ
        </span>
        <h2 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">
          Everything you need to know about SEOMind AI.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-300 ${
                isOpen
                  ? 'border-teal/50 bg-teal/5'
                  : 'border-border bg-card/50 hover:border-teal/30'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className={`text-base font-semibold ${isOpen ? 'text-teal' : 'text-foreground'}`}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-teal' : ''
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}