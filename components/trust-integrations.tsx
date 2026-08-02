'use client'

import Image from 'next/image'
import { useTranslation } from '@/lib/i18n'

export function TrustIntegrations() {
  const { t } = useTranslation()
  
  const row1 = [
    { name: 'Google My Business', src: '/logos/google my business.svg' },
    { name: 'Google Search Console', src: '/logos/google search console.svg' },
    { name: 'Meta', src: '/logos/meta.svg' },
    { name: 'Moz', src: '/logos/Moz.svg' },
    { name: 'HubSpot', src: '/logos/hubspot.svg' },
    { name: 'WordPress', src: '/logos/wordpress.svg' },
    { name: 'Google Analytics', src: '/logos/google analytics.svg' },
    { name: 'Shopify', src: '/logos/shopify.svg' },
  ]

  const row2 = [
    { name: 'Semrush', src: '/logos/semrush.svg' },
    { name: 'Ahrefs', src: '/logos/ahrefs.svg' },
    { name: 'Mailchimp', src: '/logos/mailchimp.svg' },
    { name: 'Stripe', src: '/logos/stripe.svg' },
    { name: 'NotionPress', src: '/logos/NotionPress.svg' },
    { name: 'Qwen AI', src: '/logos/qwen.svg' },
    { name: 'OpenAI', src: '/logos/openai.svg' },
    { name: 'Webflow', src: '/logos/webflow.svg' },
    { name: 'Hostinger', src: '/logos/hostinger.svg' },
    { name: 'Zapier', src: '/logos/zapier.svg' },
    { name: 'Slack', src: '/logos/slack.svg' },
  ]

  return (
    <section className="relative z-0 overflow-hidden py-20">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          {t('trust.title')} 12,400+ websites worldwide
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          {t('trust.subtitle')}
        </p>
      </div>

      {/* Marquee Row 1 */}
      <div className="relative mb-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#0d1b2a] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#0d1b2a] to-transparent" />
        <div className="marquee-row-1 flex gap-6">
          {[...row1, ...row1].map((item, i) => (
            <div key={`row1-${i}`} className="flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-sm transition-all hover:border-teal/50 hover:bg-white/10" style={{ minWidth: '160px' }}>
              <Image src={item.src} alt={item.name} width={120} height={32} className="h-8 w-auto object-contain opacity-90 transition-all hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Row 2 */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#0d1b2a] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#0d1b2a] to-transparent" />
        <div className="marquee-row-2 flex gap-6">
          {[...row2, ...row2].map((item, i) => (
            <div key={`row2-${i}`} className="flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-sm transition-all hover:border-teal/50 hover:bg-white/10" style={{ minWidth: '160px' }}>
              <Image src={item.src} alt={item.name} width={120} height={32} className="h-8 w-auto object-contain opacity-90 transition-all hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}