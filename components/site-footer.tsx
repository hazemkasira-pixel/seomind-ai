'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'

export function SiteFooter() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/50 bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © {currentYear} SEOMind AI. {t('footer.rights')}
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <Link 
            href="/privacy" 
            className="text-sm text-muted-foreground hover:text-teal transition-colors"
          >
            {t('footer.links.privacy')}
          </Link>
          <Link 
            href="/terms" 
            className="text-sm text-muted-foreground hover:text-teal transition-colors"
          >
            {t('footer.links.terms')}
          </Link>
        </div>
      </div>
    </footer>
  )
}