const stats = [
  { value: '12,400+', label: 'sites optimized' },
  { value: '4.9/5', label: 'avg rating' },
  { value: '3.2x', label: 'traffic growth' },
  { value: '24/7', label: 'AI monitoring' },
]

export function StatsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-card/40 px-6 py-12 backdrop-blur-sm">
        <dl className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-4xl font-extrabold text-teal">{stat.value}</dt>
              <dd className="mt-2 text-muted-foreground">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
