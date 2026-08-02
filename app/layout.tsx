import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'
import { Inter } from 'next/font/google'
import { I18nProvider } from '@/lib/i18n' // ✅ إضافة مزود الترجمة
import './globals.css'

// ✅ تحميل الخط محلياً وتحسينه
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SEOMind AI - AI-Powered SEO Analysis Tool',
  description: 'Get instant, actionable SEO insights powered by advanced AI. Analyze, optimize, and dominate your local market with SEOMind AI.',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://seomind-ai.vercel.app',
    siteName: 'SEOMind AI',
    title: 'SEOMind AI',
    description: 'AI-Powered SEO Analysis Tool.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <I18nProvider> {/* ✅ تغليف المحتوى بمزود الترجمة */}
        <html lang="en" className={inter.className}>
          <body className="antialiased">
            {children}
            <Toaster position="top-center" richColors />
          </body>
        </html>
      </I18nProvider>
    </ClerkProvider>
  )
}