'use client'

import { useTranslation } from '@/lib/i18n'

export function StatsSection() {
  const { t } = useTranslation()
  const statsResult = t('stats.items')
  
  // ✅ الحماية: التأكد من أن البيانات مصفوفة قبل عمل map
  const stats = Array.isArray(statsResult) ? statsResult : []

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-card/40 px-6 py-12 backdrop-blur-sm">
        <dl className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map((stat: any, index: number) => (
            <div key={index}>
              <dt className="text-4xl font-extrabold text-teal">{stat.value || stat}</dt>
              <dd className="mt-2 text-muted-foreground">{stat.label || ''}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}