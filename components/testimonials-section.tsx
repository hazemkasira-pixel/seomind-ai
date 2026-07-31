import { Star } from 'lucide-react'

type Testimonial = {
  name: string
  role: string
  company: string
  initials: string
  quote: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'Head of Growth',
    company: 'CloudDesk',
    initials: 'SC',
    quote: 'SEOMind AI took our blog from 2,000 to 18,000 monthly organic visitors in under 3 months. The auto-publishing alone saves us 20 hours a week.',
  },
  {
    name: 'Marcus Johnson',
    role: 'Founder',
    company: 'RankRight Agency',
    initials: 'MJ',
    quote: 'I was skeptical, but the content quality is genuinely impressive. It ranks, reads well, and the keyword research feels like magic.',
  },
  {
    name: 'Elena Rodriguez',
    role: 'SEO Director',
    company: 'Nexa Digital',
    initials: 'ER',
    quote: 'The competitor analysis feature gave us a playbook we never had before. Our clients are seeing measurable traffic growth within weeks.',
  },
  {
    name: 'David Kim',
    role: 'Content Manager',
    company: 'TechFlow',
    initials: 'DK',
    quote: 'We publish 50+ articles a month now without hiring extra writers. The ROI is insane — 8x return in the first quarter alone.',
  },
  {
    name: 'Priya Patel',
    role: 'Marketing Lead',
    company: 'GrowthHub',
    initials: 'PP',
    quote: 'Finally, an AI tool that actually understands SEO. Our domain authority jumped 15 points in 6 months.',
  },
  {
    name: 'James Wilson',
    role: 'CEO',
    company: 'StartupLab',
    initials: 'JW',
    quote: 'We replaced 3 tools with SEOMind AI. Keyword research, content creation, and publishing — all in one place.',
  },
  {
    name: 'Amira Hassan',
    role: 'Digital Strategist',
    company: 'MENA Growth',
    initials: 'AH',
    quote: 'The Arabic content support is outstanding. We finally found a tool that handles our regional SEO properly.',
  },
  {
    name: 'Robert Taylor',
    role: 'E-commerce Director',
    company: 'ShopSmart',
    initials: 'RT',
    quote: 'Product pages that actually rank. Our organic sales increased 340% after switching to SEOMind AI.',
  },
  {
    name: 'Lisa Anderson',
    role: 'Content Director',
    company: 'MediaPro',
    initials: 'LA',
    quote: 'The quality control is what sold me. Every article passes our editorial standards without major edits.',
  },
  {
    name: 'Omar Al-Rashid',
    role: 'Founder',
    company: 'Gulf Tech',
    initials: 'OA',
    quote: 'Best investment we made this year. The time savings alone justify the cost, but the results are the real win.',
  },
  {
    name: 'Sophie Martin',
    role: 'SEO Consultant',
    company: 'Freelance',
    initials: 'SM',
    quote: 'I manage 12 client sites with SEOMind AI. What used to take my whole team now takes me alone.',
  },
  {
    name: 'Michael Brown',
    role: 'VP Marketing',
    company: 'Enterprise Co',
    initials: 'MB',
    quote: 'Enterprise-grade SEO automation that actually delivers. Our content team is 5x more productive now.',
  },
  {
    name: 'Yuki Tanaka',
    role: 'Growth Manager',
    company: 'Asia Digital',
    initials: 'YT',
    quote: 'The multilingual support is a game-changer. We rank in 8 markets now with the same team size.',
  },
  {
    name: 'Carlos Mendez',
    role: 'Agency Owner',
    company: 'LatAm SEO',
    initials: 'CM',
    quote: 'Client retention went from 60% to 95% after we started using SEOMind AI. Results speak for themselves.',
  },
  {
    name: 'Emma Thompson',
    role: 'Head of Content',
    company: 'SaaS Weekly',
    initials: 'ET',
    quote: 'We went from 5 to 40 articles per month. Traffic tripled, and the content quality actually improved.',
  },
  {
    name: 'Ahmed Nasser',
    role: 'Marketing Director',
    company: 'Cairo Tech',
    initials: 'AN',
    quote: 'The local SEO features are incredibly powerful. We dominate Google Maps in our niche now.',
  },
  {
    name: 'Jennifer Lee',
    role: 'Founder',
    company: 'Niche Sites Inc',
    initials: 'JL',
    quote: 'I built 5 affiliate sites with SEOMind AI. All of them are profitable within 6 months.',
  },
  {
    name: 'Thomas Mueller',
    role: 'SEO Lead',
    company: 'Euro Digital',
    initials: 'TM',
    quote: 'GDPR-compliant, multilingual, and actually effective. Rare to find all three in one tool.',
  },
  {
    name: 'Fatima Zahra',
    role: 'Content Strategist',
    company: 'MENA Media',
    initials: 'FZ',
    quote: 'The AI understands context, not just keywords. Our bounce rate dropped 40% with the new content.',
  },
  {
    name: 'Ryan O\'Brien',
    role: 'Agency Director',
    company: 'Dublin Digital',
    initials: 'RO',
    quote: 'We scaled from 5 to 50 clients without hiring. SEOMind AI is our secret weapon.',
  },
  {
    name: 'Nina Petrov',
    role: 'Growth Hacker',
    company: 'StartupXYZ',
    initials: 'NP',
    quote: 'From zero to 50K monthly visitors in 8 months. The auto-publishing schedule is brilliant.',
  },
  {
    name: 'Daniel Garcia',
    role: 'E-commerce Manager',
    company: 'ShopLocal',
    initials: 'DG',
    quote: 'Category pages that rank, product descriptions that convert. Our organic revenue doubled.',
  },
  {
    name: 'Aisha Mohammed',
    role: 'Digital Manager',
    company: 'Riyadh Tech',
    initials: 'AM',
    quote: 'The best Arabic SEO tool on the market. Finally, content that ranks in the MENA region.',
  },
  {
    name: 'Kevin Wright',
    role: 'SEO Specialist',
    company: 'RankBoost',
    initials: 'KW',
    quote: 'I tested 15 AI writing tools. SEOMind AI is the only one that produces content that actually ranks.',
  },
  {
    name: 'Laura Bianchi',
    role: 'Marketing Manager',
    company: 'Milano Digital',
    initials: 'LB',
    quote: 'Italian content that sounds natural AND ranks. We increased organic traffic by 280% in 4 months.',
  },
  {
    name: 'Hassan Ali',
    role: 'Founder',
    company: 'Dubai Startups',
    initials: 'HA',
    quote: 'The competitor tracking feature alone is worth the price. We know exactly what our rivals are doing.',
  },
  {
    name: 'Rachel Green',
    role: 'Content Lead',
    company: 'Blog Empire',
    initials: 'RG',
    quote: 'We manage 20+ niche sites. SEOMind AI cut our content production time by 80%.',
  },
  {
    name: 'Ibrahim Khalil',
    role: 'SEO Manager',
    company: 'Cairo Agency',
    initials: 'IK',
    quote: 'The keyword clustering feature is genius. We target entire topic clusters, not just single keywords.',
  },
  {
    name: 'Victoria Smith',
    role: 'Head of Marketing',
    company: 'Brand Builders',
    initials: 'VS',
    quote: 'Our content calendar went from chaotic to automated. We publish consistently for the first time ever.',
  },
  {
    name: 'Mohammed Al-Saud',
    role: 'CEO',
    company: 'Saudi Tech',
    initials: 'MS',
    quote: 'Enterprise features at startup pricing. The white-label reports impress our biggest clients.',
  },
  {
    name: 'Anna Kowalski',
    role: 'SEO Director',
    company: 'Warsaw Digital',
    initials: 'AK',
    quote: 'Polish, Czech, Hungarian — SEOMind AI handles all our Eastern European markets perfectly.',
  },
  {
    name: 'Chris Evans',
    role: 'Founder',
    company: 'Content Kings',
    initials: 'CE',
    quote: 'I fired my content agency after 2 months with SEOMind AI. Better results, 1/10th the cost.',
  },
]

export function TestimonialsSection() {
  // Divide into 3 rows for marquee effect
  const row1 = testimonials.slice(0, 11)
  const row2 = testimonials.slice(11, 22)
  const row3 = testimonials.slice(22)

  return (
    <section id="testimonials" className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="inline-flex items-center rounded-full border border-teal/40 bg-teal/5 px-4 py-1.5 text-sm font-medium text-teal">
            Testimonials
          </span>
          <h2 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Loved by <span className="gradient-text">30,000+</span> Marketers
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Real results from real businesses using SEOMind AI every day.
          </p>
        </div>
      </div>

      {/* Row 1 - Left */}
      <div className="relative mb-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#0d1b2a] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#0d1b2a] to-transparent" />

        <div className="marquee-row-1 flex gap-6">
          {row1.map((t, i) => (
            <TestimonialCard key={`r1-${i}`} {...t} />
          ))}
          {row1.map((t, i) => (
            <TestimonialCard key={`r1-dup-${i}`} {...t} />
          ))}
        </div>
      </div>

      {/* Row 2 - Right */}
      <div className="relative mb-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#0d1b2a] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#0d1b2a] to-transparent" />

        <div className="marquee-row-2 flex gap-6">
          {row2.map((t, i) => (
            <TestimonialCard key={`r2-${i}`} {...t} />
          ))}
          {row2.map((t, i) => (
            <TestimonialCard key={`r2-dup-${i}`} {...t} />
          ))}
        </div>
      </div>

      {/* Row 3 - Left */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#0d1b2a] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#0d1b2a] to-transparent" />

        <div className="marquee-row-1 flex gap-6">
          {row3.map((t, i) => (
            <TestimonialCard key={`r3-${i}`} {...t} />
          ))}
          {row3.map((t, i) => (
            <TestimonialCard key={`r3-dup-${i}`} {...t} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ name, role, company, initials, quote }: Testimonial) {
  return (
    <div className="flex shrink-0 w-[380px] flex-col rounded-2xl border border-white/10 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-teal/50 hover:bg-card">
      {/* Stars */}
      <div className="mb-4 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-teal text-teal" />
        ))}
      </div>

      {/* Quote */}
      <p className="mb-6 flex-1 text-sm leading-relaxed text-foreground">
        "{quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal to-purple text-xs font-bold text-white">
          {initials}
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{name}</div>
          <div className="text-xs text-muted-foreground">
            {role}, {company}
          </div>
        </div>
      </div>
    </div>
  )
}