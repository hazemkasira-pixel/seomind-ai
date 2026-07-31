import {
  ArrowRight,
  BarChart3,
  Rocket,
  Search,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Feature = {
  icon: LucideIcon
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: Search,
    title: 'AI Content Analysis',
    description: 'Deep semantic analysis of your site and top-ranking competitors — instantly.',
  },
  {
    icon: Rocket,
    title: 'Auto Publishing',
    description: 'AI writes and publishes SEO-optimized posts directly to your CMS on autopilot.',
  },
  {
    icon: TrendingUp,
    title: 'SEO Optimization',
    description: "On-page, technical, and content optimization tuned to Google's latest signals.",
  },
  {
    icon: Users,
    title: 'Competitor Analysis',
    description: "See what's working for competitors — and get an AI plan to outrank them.",
  },
  {
    icon: Target,
    title: 'Keyword Research',
    description: 'Find high-intent, low-competition keywords surfaced by predictive AI models.',
  },
  {
    icon: BarChart3,
    title: 'Performance Tracking',
    description: 'Live rankings, traffic, and conversion insights in one clean dashboard.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="inline-flex items-center rounded-full border border-teal/40 bg-teal/5 px-4 py-1.5 text-sm font-medium text-teal">
          Features
        </span>
        <h2 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Everything You Need. <span className="gradient-text">Nothing You Don&apos;t.</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">
          Built to replace an entire SEO team — powered by AI that never sleeps.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  )
}

function FeatureCard({ icon: Icon, title, description }: Feature) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:shadow-[0_0_40px_-12px_rgba(123,44,191,0.6)]">
      <div className="absolute right-6 top-6 text-muted-foreground transition-colors group-hover:text-teal">
        <ArrowRight className="h-5 w-5" />
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,rgba(0,212,170,0.15),rgba(123,44,191,0.2))] text-teal">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-6 text-xl font-bold">{title}</h3>
      <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}
