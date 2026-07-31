import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'SEOMind AI - AI-Powered SEO Analysis Tool',
  description: 'Get instant, actionable SEO insights powered by advanced AI. Analyze, optimize, and dominate your local market with SEOMind AI. Supports 150+ business niches across 40+ countries.',
  keywords: ['SEO', 'AI SEO', 'SEO Analysis', 'Local SEO', 'SEO Tool', 'Website Optimization', 'SEO Audit'],
  authors: [{ name: 'Hazem Kasira' }],
  creator: 'Hazem Kasira',
  publisher: 'SEOMind AI',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://seomind-ai.vercel.app',
    siteName: 'SEOMind AI',
    title: 'SEOMind AI - AI-Powered SEO Analysis Tool',
    description: 'Get instant, actionable SEO insights powered by advanced AI. Analyze, optimize, and dominate your local market.',
    images: [
      {
        url: 'https://seomind-ai.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SEOMind AI - AI-Powered SEO Analysis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEOMind AI - AI-Powered SEO Analysis Tool',
    description: 'Get instant, actionable SEO insights powered by advanced AI.',
    images: ['https://seomind-ai.vercel.app/og-image.png'],
    creator: '@hazemkasira',
  },
  verification: {
    google: '', // هتضيفه بعدين لو عايز
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}