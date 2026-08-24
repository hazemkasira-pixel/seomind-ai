'use client'

import { Check, Star, Zap, Shield, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function PricingSection() {
  const comparisonFeatures = [
    { name: 'Monthly Price', us: '$79/mo', them: '$149/mo', highlight: true },
    { name: 'Articles/Month', us: '30', them: '30' },
    { name: 'Arabic Support (RTL)', us: 'Professional', them: 'Generic', best: true },
    { name: 'Custom Images', us: 'AI-Generated', them: 'Stock Photos', best: true },
    { name: 'Auto-Publish', us: 'WordPress + More', them: 'Limited' },
    { name: 'Keyword Research', us: 'Advanced AI', them: 'Basic', best: true },
    { name: 'Competitor Analysis', us: 'Included', them: 'Extra Cost', best: true },
    { name: 'Support', us: '24/7 Priority', them: 'Email Only', best: true },
    { name: 'Setup Time', us: '5 Minutes', them: '1-2 Days', best: true },
  ]

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start with a $1 trial. No commitment. Cancel anytime.
          </p>
        </div>

        {/* Trial Banner */}
        <div className="max-w-3xl mx-auto mb-16 rounded-2xl bg-gradient-to-r from-teal/10 to-purple/10 border-2 border-teal/30 p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-2">
             Try SEOMind AI for Just $1
          </h3>
          <p className="text-muted-foreground mb-4">
            Get 3 fully optimized, bilingual articles published on your website
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-teal" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-teal" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-teal" />
              Full quality guarantee
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* Starter Plan */}
          <div className="rounded-2xl border border-border bg-card/50 p-8">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-foreground">Starter</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Perfect for small websites getting started
              </p>
            </div>
            
            <div className="mb-6">
              <span className="text-5xl font-bold text-foreground">$39</span>
              <span className="text-muted-foreground">/month</span>
              <p className="text-sm text-muted-foreground mt-2">
                Billed yearly ($468/year)<br />
                or $49/month billed monthly
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-teal flex-shrink-0" />
                <span className="text-sm">10 AI articles/month</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-teal flex-shrink-0" />
                <span className="text-sm">Basic keyword research</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-teal flex-shrink-0" />
                <span className="text-sm">1 website</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-teal flex-shrink-0" />
                <span className="text-sm">Bilingual content (EN+AR)</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-teal flex-shrink-0" />
                <span className="text-sm">Email support</span>
              </li>
            </ul>

            <Link 
              href="/signup?plan=starter"
              className="block w-full rounded-lg border border-teal bg-teal/10 px-6 py-3 text-center text-sm font-semibold text-teal hover:bg-teal/20 transition"
            >
              Start $1 Trial
            </Link>
          </div>

          {/* Professional Plan - MOST POPULAR */}
          <div className="relative rounded-2xl border-2 border-teal bg-card/80 p-8 shadow-xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-gradient-to-r from-teal to-purple px-4 py-1 text-sm font-semibold text-white">
                ⭐ Most Popular
              </span>
            </div>

            <div className="mb-4">
              <h3 className="text-2xl font-bold text-foreground">Professional</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Best for growing businesses (50% cheaper than competitors)
              </p>
            </div>
            
            <div className="mb-6">
              <span className="text-5xl font-bold text-foreground">$79</span>
              <span className="text-muted-foreground">/month</span>
              <p className="text-sm text-muted-foreground mt-2">
                Billed yearly ($948/year)<br />
                or $99/month billed monthly
              </p>
              <p className="text-xs text-teal mt-2 line-through">
                Regular: $149/month
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-teal flex-shrink-0" />
                <span className="text-sm font-semibold">30 AI articles/month</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-teal flex-shrink-0" />
                <span className="text-sm">Advanced keyword research</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-teal flex-shrink-0" />
                <span className="text-sm">5 websites</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-teal flex-shrink-0" />
                <span className="text-sm">Competitor analysis</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-teal flex-shrink-0" />
                <span className="text-sm">Custom AI images</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-teal flex-shrink-0" />
                <span className="text-sm">Auto-publish to WordPress</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-teal flex-shrink-0" />
                <span className="text-sm">Priority support</span>
              </li>
            </ul>

            <Link 
              href="/signup?plan=professional"
              className="block w-full rounded-lg bg-gradient-to-r from-teal to-purple px-6 py-3 text-center text-sm font-semibold text-white hover:opacity-90 transition shadow-lg"
            >
              Start $1 Trial →
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="rounded-2xl border border-border bg-card/50 p-8">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-foreground">Enterprise</h3>
              <p className="text-sm text-muted-foreground mt-2">
                For agencies and large teams
              </p>
            </div>
            
            <div className="mb-6">
              <span className="text-5xl font-bold text-foreground">$149</span>
              <span className="text-muted-foreground">/month</span>
              <p className="text-sm text-muted-foreground mt-2">
                Billed yearly ($1,788/year)<br />
                or $199/month billed monthly
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-teal flex-shrink-0" />
                <span className="text-sm">Unlimited articles</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-teal flex-shrink-0" />
                <span className="text-sm">Unlimited websites</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-teal flex-shrink-0" />
                <span className="text-sm">Full SEO suite access</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-teal flex-shrink-0" />
                <span className="text-sm">White-label reports</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-teal flex-shrink-0" />
                <span className="text-sm">Dedicated account manager</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-teal flex-shrink-0" />
                <span className="text-sm">API access</span>
              </li>
            </ul>

            <Link 
              href="/signup?plan=enterprise"
              className="block w-full rounded-lg border border-border px-6 py-3 text-center text-sm font-semibold text-foreground hover:bg-card transition"
            >
              Contact Sales
            </Link>
          </div>
        </div>

        {/* Professional Comparison Table */}
        <div className="mt-24 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Why Choose <span className="text-teal">SEOMind AI</span>?
            </h3>
            <p className="text-lg text-muted-foreground">
              We're not just cheaper. We're <span className="text-teal font-semibold">better in every way</span>.
            </p>
            
            {/* Savings Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal to-emerald text-white px-6 py-3 rounded-xl shadow-lg shadow-teal/20 mt-6">
              <Zap className="h-5 w-5" />
              <span className="text-lg font-bold">Save $840/Year</span>
            </div>
          </div>

          {/* Comparison Grid - Fixed Alignment */}
          <div className="rounded-3xl border border-border bg-card/50 overflow-hidden shadow-xl">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-border">
              <div className="p-6 bg-muted/30 text-center">
                <h4 className="text-lg font-semibold text-muted-foreground">Feature</h4>
              </div>
              <div className="p-6 bg-gradient-to-b from-teal/10 to-teal/5 border-x border-teal/20 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Star className="h-5 w-5 text-teal fill-teal" />
                  <h4 className="text-lg font-bold text-teal">SEOMind AI</h4>
                </div>
              </div>
              <div className="p-6 bg-muted/30 text-center">
                <h4 className="text-lg font-semibold text-muted-foreground">Competitors</h4>
              </div>
            </div>

            {/* Features Rows */}
            {comparisonFeatures.map((feature, index) => (
              <div 
                key={feature.name}
                className={`grid grid-cols-3 border-b border-border/50 ${
                  index % 2 === 0 ? 'bg-background/50' : 'bg-background'
                }`}
              >
                <div className="p-4 flex items-center justify-center text-center">
                  <span className="text-foreground font-medium">{feature.name}</span>
                </div>
                <div className={`p-4 flex items-center justify-center text-center border-x border-teal/10 ${
                  feature.highlight ? 'bg-teal/5' : ''
                }`}>
                  <span className={`font-semibold ${feature.best ? 'text-teal' : 'text-foreground'}`}>
                    {feature.us}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-center text-center">
                  <span className="text-muted-foreground">
                    {feature.them}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Guarantee Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-teal/5 to-purple/5 border-2 border-teal/20 p-8 md:p-12 shadow-xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal to-purple rounded-full flex items-center justify-center shadow-lg shadow-teal/30">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Sparkles className="h-4 w-4 text-teal" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-2xl font-bold text-foreground mb-3">
                  100% Satisfaction Guarantee
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  If we don't publish <span className="text-teal font-semibold">30 high-quality articles</span> in your first month, 
                  you get the next month <span className="text-teal font-semibold">completely free</span>. 
                  No questions asked. No fine print.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}