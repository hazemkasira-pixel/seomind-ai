'use client'

import { Sparkles, MapPin, Target } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function FeaturesSection() {
  const { t } = useTranslation()

  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-teal" />,
      title: t('features.items.aiPowered.title'),
      desc: t('features.items.aiPowered.desc'),
    },
    {
      icon: <MapPin className="h-8 w-8 text-purple" />,
      title: t('features.items.localSeo.title'),
      desc: t('features.items.localSeo.desc'),
    },
    {
      icon: <Target className="h-8 w-8 text-teal" />,
      title: t('features.items.competitor.title'),
      desc: t('features.items.competitor.desc'),
    },
  ]

  return (
    <section id="features" className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glow-border rounded-2xl p-8 bg-card/50 border border-border/50 hover:border-teal/50 transition-all duration-300"
            >
              <div className="mb-6 inline-flex p-3 rounded-xl bg-teal/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}