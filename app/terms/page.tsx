import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using SEOMind AI ("Service"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. Description of Service</h2>
            <p>
              SEOMind AI provides AI-powered SEO analysis tools that analyze websites and provide 
              actionable recommendations for search engine optimization. The Service is provided "as is" 
              without warranties of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. 
              You agree to accept responsibility for all activities that occur under your account. 
              You must notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Use the Service to analyze websites you do not own or have permission to analyze</li>
              <li>Resell or redistribute the Service without authorization</li>
              <li>Interfere with or disrupt the Service or servers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by SEOMind AI 
              and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. 
              WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. 
              SEO RESULTS MAY VARY AND ARE NOT GUARANTEED.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Limitation of Liability</h2>
            <p>
              IN NO EVENT SHALL SEOMIND AI BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
              CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will provide notice of 
              significant changes. Your continued use of the Service constitutes acceptance of 
              the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">9. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us at:
              <br />
              <strong>Email:</strong> support@seomind-ai.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}