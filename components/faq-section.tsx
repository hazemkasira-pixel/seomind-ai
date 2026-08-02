'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function FaqSection() {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  
  // Fetch FAQs from translation file
  const faqs = t('faq.items') as any[]

  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-16 text-center">
        <span className="inline-flex items-center rounded-full border border-teal/40 bg-teal/5 px-4 py-1.5 text-sm font-medium text-teal">
          FAQ
        </span>
        <h2 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {t('faq.title').split(' ')[0]} <span className="gradient-text">{t('faq.title').split(' ').slice(1).join(' ')}</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">
          {t('faq.subtitle')}
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq: any, index: number) => {
          const isOpen = openIndex === index
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-300 ${
                isOpen ? 'border-teal/50 bg-teal/5' : 'border-border bg-card/50 hover:border-teal/30'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className={`text-base font-semibold ${isOpen ? 'text-teal' : 'text-foreground'}`}>
                  {faq.q}
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
                    {faq.a}
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