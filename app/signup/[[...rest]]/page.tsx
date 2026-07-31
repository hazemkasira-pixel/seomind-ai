import { SignUp } from '@clerk/nextjs'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[520px] w-[720px] max-w-[95vw] animate-float rounded-full bg-purple/20 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-10 h-[260px] w-[420px] max-w-[90vw] -translate-x-1/2 rounded-full bg-teal/10 blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        <SignUp
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'glow-border p-8 rounded-2xl bg-card/50 backdrop-blur-xl',
              headerTitle: 'text-2xl font-bold text-foreground mb-2',
              headerSubtitle: 'text-muted-foreground',
              socialButtonsBlockButton: 'w-full h-12 rounded-xl border border-border bg-background/60 text-foreground hover:bg-background/80',
              formFieldInput: 'w-full h-12 rounded-xl border border-border bg-background/60 px-4 text-sm text-foreground outline-none focus:border-teal/70 focus:ring-1 focus:ring-teal/40',
              formButtonPrimary: 'w-full h-12 rounded-xl bg-gradient-to-r from-teal to-purple text-white font-semibold shadow-lg shadow-teal/20 hover:scale-[1.01]',
              footerActionLink: 'text-teal hover:underline',
            },
          }}
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  )
}