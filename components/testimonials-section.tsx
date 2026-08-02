'use client'

import { Star } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function TestimonialsSection() {
  const { t } = useTranslation()
  // We fetch the array from JSON and slice it for the marquee effect
  const allTestimonials = t('testimonials.items') as any[]
  
  // Ensure we have enough items to map, fallback to empty array if not
  const row1 = allTestimonials.slice(0, 2)
  const row2 = allTestimonials.slice(2, 4)
  const row3 = allTestimonials.slice(4, 6)

  return (
    <section id="testimonials" className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="inline-flex items-center rounded-full border border-teal/40 bg-teal/5 px-4 py-1.5 text-sm font-medium text-teal">
            {t('testimonials.title')}
          </span>
          <h2 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {t('testimonials.title')} <span className="gradient-text">SEOMind AI</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            {t('testimonials.subtitle')}
          </p>
        </div>
      </div>

      {/* Row 1 */}
      <div className="relative mb-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#0d1b2a] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#0d1b2a] to-transparent" />
        <div className="marquee-row-1 flex gap-6">
          {[...row1, ...row1].map((t_item: any, i: number) => (
            <TestimonialCard key={`r1-${i}`} {...t_item} />
          ))}
        </div>
      </div>

      {/* Row 2 */}
      <div className="relative mb-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#0d1b2a] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#0d1b2a] to-transparent" />
        <div className="marquee-row-2 flex gap-6">
          {[...row2, ...row2].map((t_item: any, i: number) => (
            <TestimonialCard key={`r2-${i}`} {...t_item} />
          ))}
        </div>
      </div>

      {/* Row 3 */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#0d1b2a] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#0d1b2a] to-transparent" />
        <div className="marquee-row-1 flex gap-6">
          {[...row3, ...row3].map((t_item: any, i: number) => (
            <TestimonialCard key={`r3-${i}`} {...t_item} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ name, role, company, initials, quote }: any) {
  return (
    <div className="flex shrink-0 w-[380px] flex-col rounded-2xl border border-white/10 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-teal/50 hover:bg-card">
      <div className="mb-4 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-teal text-teal" />
        ))}
      </div>
      <p className="mb-6 flex-1 text-sm leading-relaxed text-foreground">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal to-purple text-xs font-bold text-white">
          {initials}
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{name}</div>
          <div className="text-xs text-muted-foreground">{role}, {company}</div>
        </div>
      </div>
    </div>
  )
}