'use client'

import { Check, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'

export function PricingSection() {
  const { t } = useTranslation()
  
  const plans = [
    {
      key: 'starter',
      highlighted: false,
      badgeKey: '',
    },
    {
      key: 'professional',
      highlighted: true,
      badgeKey: 'pricing.plans.professional.badge',
    },
    {
      key: 'enterprise',
      highlighted: false,
      badgeKey: '',
    }
  ]

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="inline-flex items-center rounded-full border border-teal/40 bg-teal/5 px-4 py-1.5 text-sm font-medium text-teal">
          {t('nav.pricing')}
        </span>
        <h2 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {t('pricing.title')}
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">
          {t('pricing.subtitle')}
        </p>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const planData = t(`pricing.plans.${plan.key}`)
          // ✅ حماية لضمان أن الميزات قائمة قبل استخدام map
          const features = Array.isArray(planData.features) ? planData.features : []
          const badgeText = plan.badgeKey ? t(plan.badgeKey) : ''
          const freeTrialText = planData.freeTrial || ''

          return (
            <div
              key={plan.key}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
                plan.highlighted
                  ? 'border-teal/50 bg-gradient-to-b from-teal/10 to-transparent shadow-[0_0_40px_-12px_rgba(0,212,170,0.4)]'
                  : 'border-border bg-card/50 hover:border-teal/30'
              }`}
            >
              {badgeText && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-teal to-purple px-4 py-1 text-xs font-bold text-white shadow-lg">
                    <Sparkles className="h-3 w-3" />
                    {badgeText}
                  </span>
                </div>
              )}

              {freeTrialText && (
                <div className="absolute -top-3 right-4">
                  <span className="inline-flex items-center rounded-full bg-teal/20 border border-teal/40 px-3 py-1 text-xs font-bold text-teal">
                    {freeTrialText}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground">{planData.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{planData.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">${planData.yearlyPrice}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Billed yearly (${planData.yearlyPrice * 12}/year)
                </p>
                <p className="text-xs text-teal">
                  or ${planData.monthlyPrice}/month billed monthly
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className={`inline-flex items-center justify-center w-full h-12 rounded-xl text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-teal to-purple text-white shadow-lg shadow-teal/20 hover:scale-[1.01]'
                    : 'border border-border bg-background/60 text-foreground hover:border-teal/50 hover:bg-teal/10'
                }`}
              >
                {planData.cta}
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}