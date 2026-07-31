import { ArrowRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Connect Your Site',
    description: 'Paste your URL — we crawl and understand your business in seconds.',
  },
  {
    number: '02',
    title: 'AI Analysis',
    description: 'Our models audit content, keywords, structure, and competitors.',
  },
  {
    number: '03',
    title: 'Review & Approve',
    description: 'Get a clear content plan. Approve, edit, or let AI handle it all.',
  },
  {
    number: '04',
    title: 'Auto Publish',
    description: 'AI publishes optimized articles on schedule and tracks rankings live.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-purple/30 bg-[linear-gradient(160deg,rgba(123,44,191,0.28),rgba(13,27,42,0.4))] px-6 py-16 sm:px-10 lg:px-14">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-teal/40 bg-teal/5 px-4 py-1.5 text-sm font-medium text-teal">
            How it works
          </span>
          <h2 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Built on Trust. <span className="gradient-text">Driven by Results.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Four steps from a raw URL to a ranking machine.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal/40"
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl font-extrabold text-foreground">{step.number}</span>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-teal" />
              </div>
              <h3 className="mt-8 text-lg font-bold">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
