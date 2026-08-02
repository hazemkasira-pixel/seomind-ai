'use client'

import { useTranslation } from '@/lib/i18n'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation()

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted"
      title={language === 'en' ? 'العربية' : 'English'}
    >
      <Globe className="h-4 w-4" />
      <span>{language === 'en' ? 'AR' : 'EN'}</span>
    </button>
  )
}