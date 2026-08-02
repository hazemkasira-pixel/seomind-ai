'use client'

import { useTranslation } from '@/lib/i18n'

export function HowItWorks() {
  const { t } = useTranslation()

  const steps = [
    {
      number: '01',
      title: t('howItWorks.steps.1.title'),
      desc: t('howItWorks.steps.1.desc'),
    },
    {
      number: '02',
      title: t('howItWorks.steps.2.title'),
      desc: t('howItWorks.steps.2.desc'),
    },
    {
      number: '03',
      title: t('howItWorks.steps.3.title'),
      desc: t('howItWorks.steps.3.desc'),
    },
  ]

  return (
    <section id="how-it-works" className="py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="text-6xl font-black text-teal/10 mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}