import { Check, Sparkles } from 'lucide-react'
import Link from 'next/link'

type PricingPlan = {
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  highlighted?: boolean
  badge?: string
  freeTrial?: string
}

const plans: PricingPlan[] = [
  {
    name: 'Starter',
    description: 'Perfect for small websites just getting started with AI SEO.',
    monthlyPrice: 49,
    yearlyPrice: 39,
    features: [
      '10 AI-optimized articles/month',
      'Basic keyword research',
      '1 website',
      'Email support',
    ],
    freeTrial: '30-day free trial',
  },
  {
    name: 'Professional',
    description: 'Best for growing businesses that need consistent SEO content.',
    monthlyPrice: 149,
    yearlyPrice: 119,
    features: [
      '50 AI-optimized articles/month',
      'Advanced keyword research',
      '5 websites',
      'Competitor analysis',
      'Priority support',
    ],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    description: 'For agencies and large teams managing multiple client sites.',
    monthlyPrice: 399,
    yearlyPrice: 329,
    features: [
      'Unlimited AI articles',
      'Full SEO suite access',
      'Unlimited websites',
      'White-label reports',
      'Dedicated account manager',
      'API access',
    ],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="inline-flex items-center rounded-full border border-teal/40 bg-teal/5 px-4 py-1.5 text-sm font-medium text-teal">
          Pricing
        </span>
        <h2 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Simple, Transparent <span className="gradient-text">Pricing</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">
          Start with a free trial. No credit card required. Cancel anytime.
        </p>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard key={plan.name} {...plan} />
        ))}
      </div>
    </section>
  )
}

function PricingCard({
  name,
  description,
  monthlyPrice,
  yearlyPrice,
  features,
  highlighted,
  badge,
  freeTrial,
}: PricingPlan) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
        highlighted
          ? 'border-teal/50 bg-gradient-to-b from-teal/10 to-transparent shadow-[0_0_40px_-12px_rgba(0,212,170,0.4)]'
          : 'border-border bg-card/50 hover:border-teal/30'
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-teal to-purple px-4 py-1 text-xs font-bold text-white shadow-lg">
            <Sparkles className="h-3 w-3" />
            {badge}
          </span>
        </div>
      )}

      {freeTrial && (
        <div className="absolute -top-3 right-4">
          <span className="inline-flex items-center rounded-full bg-teal/20 border border-teal/40 px-3 py-1 text-xs font-bold text-teal">
            {freeTrial}
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">{name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-foreground">${yearlyPrice}</span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Billed yearly (${yearlyPrice * 12}/year)
        </p>
        <p className="text-xs text-teal">
          or ${monthlyPrice}/month billed monthly
        </p>
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/login"
        className={`inline-flex items-center justify-center w-full h-12 rounded-xl text-sm font-semibold transition-all ${
          highlighted
            ? 'bg-gradient-to-r from-teal to-purple text-white shadow-lg shadow-teal/20 hover:scale-[1.01]'
            : 'border border-border bg-background/60 text-foreground hover:border-teal/50 hover:bg-teal/10'
        }`}
      >
        {freeTrial ? 'Start Free Trial' : 'Get Started'}
      </Link>
    </div>
  )
}