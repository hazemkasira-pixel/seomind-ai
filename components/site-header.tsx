'use client'

import { useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { UserButton, useUser } from '@clerk/nextjs'
import { LanguageSwitcher } from './language-switcher' // ✅ استيراد زر تبديل اللغة
import { useTranslation } from '@/lib/i18n' // ✅ استيراد دالة الترجمة

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isSignedIn, user } = useUser()
  const { t } = useTranslation() // ✅ تفعيل دالة الترجمة

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/')) return 
    
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center">
          <Image
            src="/seomindai.svg"
            alt="SEOMind AI"
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('nav.home')}
          </a>
          <a href="#features" onClick={(e) => handleNavClick(e, '#features')} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('nav.features')}
          </a>
          <a href="#pricing" onClick={(e) => handleNavClick(e, '#pricing')} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('nav.pricing')}
          </a>
          <a href="#how-it-works" onClick={(e) => handleNavClick(e, '#how-it-works')} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('nav.howItWorks')}
          </a>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          {/* ✅ زر تبديل اللغة يظهر هنا */}
          <LanguageSwitcher />
          
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('nav.dashboard')}
              </Link>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'h-9 w-9 rounded-full border-2 border-teal/50 hover:border-teal transition-colors',
                  },
                }}
              />
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal to-purple px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:scale-105 hover:shadow-teal/30"
            >
              {t('auth.getStarted')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-background">
          <nav className="flex flex-col gap-4 px-4 py-6">
            <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {t('nav.home')}
            </a>
            <a href="#features" onClick={(e) => handleNavClick(e, '#features')} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {t('nav.features')}
            </a>
            <a href="#pricing" onClick={(e) => handleNavClick(e, '#pricing')} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {t('nav.pricing')}
            </a>
            <a href="#how-it-works" onClick={(e) => handleNavClick(e, '#how-it-works')} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {t('nav.howItWorks')}
            </a>
            
            {/* ✅ زر تبديل اللغة في الموبايل */}
            <div className="pt-4 border-t border-white/10">
              <LanguageSwitcher />
            </div>

            {isSignedIn ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-teal hover:text-teal/80">
                  {t('nav.dashboard')}
                </Link>
                <div className="flex items-center gap-3 px-4 py-2">
                  <UserButton afterSignOutUrl="/" />
                  <span className="text-sm text-muted-foreground">
                    {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                  </span>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal to-purple px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:scale-105"
              >
                {t('auth.getStarted')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}