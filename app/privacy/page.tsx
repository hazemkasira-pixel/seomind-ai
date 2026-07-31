import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              use our SEO analysis tool, or contact us for support. This includes:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Account information (name, email address)</li>
              <li>Website URLs you submit for analysis</li>
              <li>Business niche and location data</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide, maintain, and improve our SEO analysis services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Generate aggregated, anonymized data for research</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. Data Storage and Security</h2>
            <p>
              We use industry-standard security measures to protect your data. Your website analysis 
              data is stored securely using Supabase (PostgreSQL database) with encryption at rest. 
              We use Clerk for secure authentication and never store your passwords.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Clerk:</strong> For user authentication and account management</li>
              <li><strong>Supabase:</strong> For secure data storage</li>
              <li><strong>Groq AI:</strong> For AI-powered SEO analysis</li>
              <li><strong>Vercel:</strong> For hosting and deployment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <strong>Email:</strong> support@seomind-ai.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}