'use client'

import { useState, useEffect } from 'react'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { 
  LayoutDashboard, Globe, FileText, Plus, Search, 
  CheckCircle, Send, Home, User, Building2,
  TrendingUp, BarChart3, Zap, Target, ArrowUpRight,
  Download, Share2, Calendar, ExternalLink,
  Copy, AlertCircle, Briefcase, MapPin
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { toast } from 'sonner'

// ✅ أيقونة LinkedIn كـ SVG مباشر
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

function StatCard({ title, value, icon, color, subtitle }: any) {
  const colors: any = {
    teal: 'bg-teal/10 text-teal border-teal/20 hover:border-teal/40',
    purple: 'bg-purple/10 text-purple border-purple/20 hover:border-purple/40',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:border-blue-500/40',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20 hover:border-orange-500/40',
  }
  const c = colors[color] || colors.teal

  return (
    <div className={`group relative rounded-2xl border ${c} bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}>
      <div className={`absolute inset-0 rounded-2xl ${c.split(' ')[0]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative">
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${c.split(' ')[0]} ${c.split(' ')[1]} mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <div className="flex items-baseline gap-2 mb-2">
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
        </div>
      </div>
    </div>
  )
}

// ✅ مكون التقرير التفصيلي
function AnalysisReport({ analysis, language }: { analysis: any, language: string }) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const handleCopyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSection(section)
    toast.success(language === 'ar' ? 'تم النسخ!' : 'Copied!')
    setTimeout(() => setCopiedSection(null), 2000)
  }

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    toast.info(language === 'ar' ? 'جاري إنشاء PDF...' : 'Generating PDF...')
    try {
      window.print()
      toast.success(language === 'ar' ? 'تم تنزيل التقرير!' : 'Report downloaded!')
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل في التنزيل' : 'Failed to download')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handlePublishToLinkedIn = async () => {
    setIsPublishing(true)
    try {
      const response = await fetch('/api/publish-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId: analysis.id }),
      })
      
      const data = await response.json()
      if (response.ok) {
        toast.success(language === 'ar' ? 'تم النشر على LinkedIn!' : 'Published to LinkedIn!')
      } else {
        toast.error(data.error || 'Failed to publish')
      }
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل في النشر' : 'Failed to publish')
    } finally {
      setIsPublishing(false)
    }
  }

  const handlePublishToWordPress = async () => {
    setIsPublishing(true)
    try {
      const response = await fetch('/api/publish-wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId: analysis.id }),
      })
      
      const data = await response.json()
      if (response.ok) {
        toast.success(language === 'ar' ? 'تم النشر على WordPress!' : 'Published to WordPress!')
      } else {
        toast.error(data.error || 'Failed to publish')
      }
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل في النشر' : 'Failed to publish')
    } finally {
      setIsPublishing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/30'
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/30'
    return 'bg-red-500/10 border-red-500/30'
  }

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border bg-card/50">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${getScoreBg(analysis.seo_score || 0)}`}>
            <TrendingUp className={`h-8 w-8 ${getScoreColor(analysis.seo_score || 0)}`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {language === 'ar' ? 'تقرير التحليل الشامل' : 'Comprehensive Analysis Report'}
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span className="truncate">{analysis.url}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-card transition-colors disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">
              {isGeneratingPDF ? (language === 'ar' ? 'جاري...' : 'Generating...') : 'PDF'}
            </span>
          </button>

          <button
            onClick={handlePublishToLinkedIn}
            disabled={isPublishing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20 transition-colors disabled:opacity-50"
          >
            <LinkedinIcon className="h-4 w-4" />
            <span className="text-sm font-medium">
              {isPublishing ? (language === 'ar' ? 'جاري...' : 'Publishing...') : 'LinkedIn'}
            </span>
          </button>

          <button
            onClick={handlePublishToWordPress}
            disabled={isPublishing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors disabled:opacity-50"
          >
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">WordPress</span>
          </button>
        </div>
      </div>

      {/* SEO Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-6 rounded-2xl border ${getScoreBg(analysis.seo_score || 0)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              {language === 'ar' ? 'النتيجة العامة' : 'Overall Score'}
            </span>
            <Target className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className={`text-4xl font-bold ${getScoreColor(analysis.seo_score || 0)}`}>
            {analysis.seo_score || 0}/100
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              {language === 'ar' ? 'النطاق الجغرافي' : 'Geographic Scope'}
            </span>
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-sm font-semibold text-foreground">
            {analysis.geo_scope || analysis.location}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              {language === 'ar' ? 'المجال' : 'Business Niche'}
            </span>
            <Briefcase className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-sm font-semibold text-foreground">
            {analysis.niche}
          </div>
        </div>
      </div>

      {/* ✅ قسم المنافسين في نتائج البحث */}
      {analysis.discovered_competitors && analysis.discovered_competitors.length > 0 && (
        <div className="p-6 rounded-2xl border border-border bg-card/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Target className="h-5 w-5 text-red-500" />
              {language === 'ar' ? 'المنافسون في نتائج البحث' : 'Top Search Competitors'}
            </h3>
            <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-500 font-medium border border-red-500/20">
              {language === 'ar' ? 'تحليل SERP' : 'SERP Analysis'}
            </span>
          </div>
          
          <div className="space-y-3">
            {analysis.discovered_competitors.map((competitor: any, index: number) => (
              <div 
                key={index} 
                className="p-4 rounded-xl border border-border bg-background/50 hover:bg-card transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-500 font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        {competitor.name || competitor.domain}
                      </h4>
                      <a 
                        href={`https://${competitor.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-teal hover:underline flex items-center gap-1"
                      >
                        {competitor.domain}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                  {competitor.location && (
                    <span className="text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-500 font-medium">
                      {competitor.location}
                    </span>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  {competitor.strength && (
                    <div className="p-2 rounded-lg bg-green-500/5 border border-green-500/20">
                      <p className="text-xs font-semibold text-green-500 mb-1">
                        {language === 'ar' ? 'نقاط القوة:' : 'Strengths:'}
                      </p>
                      <p className="text-xs text-foreground">{competitor.strength}</p>
                    </div>
                  )}
                  {competitor.weakness && (
                    <div className="p-2 rounded-lg bg-orange-500/5 border border-orange-500/20">
                      <p className="text-xs font-semibold text-orange-500 mb-1">
                        {language === 'ar' ? 'نقاط الضعف:' : 'Weaknesses:'}
                      </p>
                      <p className="text-xs text-foreground">{competitor.weakness}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* زر عرض التحليل التفصيلي */}
          {analysis.recommended_target && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
              <p className="text-sm font-semibold text-foreground mb-1">
                {language === 'ar' ? '🎯 المنافس الأسهل للتفوق عليه:' : '🎯 Easiest Competitor to Outrank:'}
              </p>
              <p className="text-sm text-foreground">{analysis.recommended_target}</p>
            </div>
          )}
        </div>
      )}

      {/* Issues */}
      {analysis.issues && analysis.issues.length > 0 && (
        <div className="p-6 rounded-2xl border border-border bg-card/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              {language === 'ar' ? 'المشاكل المكتشفة' : 'Discovered Issues'}
            </h3>
            <button
              onClick={() => handleCopyToClipboard(analysis.issues.join('\n'), 'issues')}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {copiedSection === 'issues' ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ' : 'Copy')}
            </button>
          </div>
          <ul className="space-y-2">
            {analysis.issues.map((issue: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="p-6 rounded-2xl border border-border bg-card/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              {language === 'ar' ? 'التوصيات' : 'Recommendations'}
            </h3>
            <button
              onClick={() => handleCopyToClipboard(analysis.recommendations.join('\n'), 'recommendations')}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {copiedSection === 'recommendations' ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ' : 'Copy')}
            </button>
          </div>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Keywords */}
      {analysis.keywords && analysis.keywords.length > 0 && (
        <div className="p-6 rounded-2xl border border-border bg-card/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              {language === 'ar' ? 'الكلمات المفتاحية المقترحة' : 'Suggested Keywords'}
            </h3>
            <button
              onClick={() => handleCopyToClipboard(analysis.keywords.join(', '), 'keywords')}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {copiedSection === 'keywords' ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ' : 'Copy')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.keywords.map((keyword: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-lg bg-purple/10 text-purple text-sm font-medium border border-purple/20"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 30-Day Plan */}
      {analysis.thirty_day_plan && analysis.thirty_day_plan.length > 0 && (
        <div className="p-6 rounded-2xl border border-border bg-card/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              {language === 'ar' ? 'خطة العمل (30 يوم)' : '30-Day Action Plan'}
            </h3>
            <button
              onClick={() => handleCopyToClipboard(analysis.thirty_day_plan.join('\n'), 'plan')}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {copiedSection === 'plan' ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ' : 'Copy')}
            </button>
          </div>
          <div className="space-y-3">
            {analysis.thirty_day_plan.map((plan: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm text-foreground pt-0.5">{plan}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blog Post Titles */}
      {analysis.blog_post_titles && analysis.blog_post_titles.length > 0 && (
        <div className="p-6 rounded-2xl border border-border bg-card/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-500" />
              {language === 'ar' ? 'عناوين المقالات المقترحة' : 'Suggested Blog Post Titles'}
            </h3>
            <button
              onClick={() => handleCopyToClipboard(analysis.blog_post_titles.join('\n'), 'titles')}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {copiedSection === 'titles' ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ' : 'Copy')}
            </button>
          </div>
          <ul className="space-y-2">
            {analysis.blog_post_titles.map((title: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-orange-500 font-bold">•</span>
                <span>{title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Competitor Insights */}
      {analysis.competitor_insights && (
        <div className="p-6 rounded-2xl border border-border bg-card/50">
          <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-teal-500" />
            {language === 'ar' ? 'رؤى المنافسين' : 'Competitor Insights'}
          </h3>
          <p className="text-sm text-foreground leading-relaxed">
            {analysis.competitor_insights}
          </p>
        </div>
      )}

      {/* Content Strategy */}
      {analysis.content_strategy && (
        <div className="p-6 rounded-2xl border border-border bg-card/50">
          <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-500" />
            {language === 'ar' ? 'استراتيجية المحتوى' : 'Content Strategy'}
          </h3>
          <p className="text-sm text-foreground leading-relaxed">
            {analysis.content_strategy}
          </p>
        </div>
      )}
    </div>
  )
}

export function DashboardView({ user, analyses, selectedAnalysis, profile }: any) {
  const { t, language } = useTranslation()
  
  const [linkedinConnected, setLinkedinConnected] = useState(false)
  const [linkedinAccountName, setLinkedinAccountName] = useState('')
  const [checkingLinkedIn, setCheckingLinkedIn] = useState(true)
  
  const accountType = profile?.account_type || 'personal'
  const companyName = profile?.company_name

  useEffect(() => {
    const checkLinkedInStatus = async () => {
      try {
        const response = await fetch('/api/linkedin-accounts')
        const data = await response.json()
        if (response.ok && data.data && data.data.length > 0) {
          setLinkedinConnected(true)
          setLinkedinAccountName(data.data[0].account_name || 'LinkedIn Account')
        }
      } catch (error) {
        console.error('Error checking LinkedIn status:', error)
      } finally {
        setCheckingLinkedIn(false)
      }
    }
    checkLinkedInStatus()
  }, [])

  const totalAnalyses = analyses?.length || 0
  const avgScore = analyses?.length > 0 
    ? Math.round(analyses.reduce((sum: number, a: any) => sum + (a.seo_score || 0), 0) / analyses.length)
    : 0
  const excellentCount = analyses?.filter((a: any) => a.seo_score >= 80).length || 0

  const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent('http://localhost:3000/api/linkedin/callback')}&scope=w_member_social,openid,profile,email`

  const welcomeMessage = accountType === 'company' 
    ? `مرحباً بك في لوحة تحكم ${companyName || 'شركتك'}!`
    : `مرحباً ${user.firstName || user.username || 'صديقي'}!`

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="hidden md:flex flex-col w-72 border-r border-border/60 bg-card/40 backdrop-blur-md h-screen sticky top-0">
        <div className="p-6 border-b border-border/50">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold text-foreground group-hover:text-teal transition-colors">SEO</span>
            <span className="text-xl font-bold text-teal">Mind</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-xl bg-teal/10 text-teal px-4 py-3 text-sm font-semibold transition-all hover:bg-teal/20">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href="#" className="flex items-center gap-3 rounded-xl text-muted-foreground px-4 py-3 text-sm font-medium transition-all hover:bg-white/5 hover:text-foreground">
            <Globe className="h-5 w-5" /> Projects
          </Link>
          
          <div className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-3 mt-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <LinkedinIcon className="h-4 w-4 text-[#0077b5]" />
              LinkedIn
            </div>
            {checkingLinkedIn ? (
              <div className="text-xs text-muted-foreground">Checking...</div>
            ) : linkedinConnected ? (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <CheckCircle className="h-3 w-3" />
                <span className="truncate">{linkedinAccountName}</span>
              </div>
            ) : (
              <div className="text-xs text-red-500">Not connected</div>
            )}
            <a 
              href={linkedinAuthUrl}
              className="block w-full text-center px-3 py-2 rounded-lg bg-[#0077b5]/10 text-[#0077b5] text-xs font-medium hover:bg-[#0077b5]/20 transition-colors"
            >
              {linkedinConnected ? 'Re-connect' : 'ربط حساب LinkedIn'}
            </a>
          </div>
        </nav>

        <div className="p-4 border-t border-border/50 space-y-3">
          <Link href="/" className="flex items-center gap-3 rounded-xl text-muted-foreground px-4 py-3 text-sm font-medium transition-all hover:bg-red-500/10 hover:text-red-500 group">
            <Home className="h-5 w-5 group-hover:scale-110 transition-transform" /> 
            Back to Home
          </Link>
          <div className="flex items-center gap-3 rounded-xl bg-background/60 p-3 border border-border/50">
            <UserButton afterSignOutUrl="/" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{user.firstName || user.username || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user.emailAddresses?.[0]?.emailAddress}</p>
              <p className="text-[10px] text-teal font-medium mt-0.5 flex items-center gap-1">
                {accountType === 'company' ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
                {accountType === 'company' ? 'Company' : 'Personal'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">{welcomeMessage} 👋</h1>
            <p className="text-muted-foreground">
              {accountType === 'company' 
                ? 'إدارة وتحسين ظهور شركتك ومحركات البحث.' 
                : 'إدارة وتطوير محتواك وعلامتك التجارية الشخصية.'}
            </p>
          </div>
          <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal to-purple px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:scale-105">
            <Plus className="h-4 w-4" /> تحليل جديد
          </Link>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="إجمالي التحليلات" value={totalAnalyses} icon={<BarChart3 className="h-6 w-6" />} color="teal" subtitle="تحليل" />
          <StatCard title="متوسط SEO Score" value={avgScore} icon={<TrendingUp className="h-6 w-6" />} color="purple" subtitle="/ 100" />
          <StatCard title="نتائج ممتازة" value={excellentCount} icon={<Target className="h-6 w-6" />} color="blue" subtitle="تحليل" />
          <StatCard title="حسابات LinkedIn" value={linkedinConnected ? 1 : 0} icon={<LinkedinIcon className="h-6 w-6" />} color="orange" subtitle="مربوط" />
        </div>

        {analyses && analyses.length > 0 ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal" /> آخر التحليلات
              </h2>
              <span className="text-xs text-muted-foreground">{totalAnalyses} تحليل</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {analyses.map((analysis: any) => {
                const cleanUrl = analysis.url.replace(/^https?:\/\//, '').replace(/\/$/, '')
                const isActive = selectedAnalysis?.id === analysis.id
                const score = analysis.seo_score || 0
                
                return (
                  <Link
                    key={analysis.id}
                    href={`/dashboard?analysis=${analysis.id}`}
                    className={`group rounded-2xl border p-5 transition-all hover:scale-[1.02] hover:shadow-lg ${
                      isActive 
                        ? 'border-teal bg-teal/5 ring-1 ring-teal/50' 
                        : 'border-border bg-card/50 hover:bg-card hover:border-teal/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground truncate max-w-[60%] group-hover:text-foreground transition-colors">
                        {cleanUrl}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                        score >= 80 ? 'bg-teal/10 border-teal/30 text-teal' :
                        score >= 60 ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' :
                        'bg-red-500/10 border-red-500/30 text-red-500'
                      }`}>
                        {score}/100
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground truncate mb-3">{analysis.niche}</p>
                    
                    <div className="w-full h-1.5 bg-border/50 rounded-full overflow-hidden mb-3">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          score >= 80 ? 'bg-gradient-to-r from-teal to-teal/70' :
                          score >= 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-500/70' :
                          'bg-gradient-to-r from-red-500 to-red-500/70'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(analysis.created_at).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-teal transition-colors" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-border/50 bg-card/30 p-12 text-center mb-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal/10">
              <Search className="h-10 w-10 text-teal" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">لا توجد تحليلات بعد</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {accountType === 'company' 
                ? 'ابدأ بتحليل موقع شركتك الإلكتروني لاكتشاف فرص تحسين محركات البحث.' 
                : 'ابدأ بتحليل موقعك أو مدونتك الشخصية لتعزيز ظهورك الرقمي.'}
            </p>
            <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal to-purple px-8 py-3 text-base font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:scale-105">
              <Plus className="h-5 w-5" /> ابدأ أول تحليل
            </Link>
          </div>
        )}

        {/* ✅ التقرير التفصيلي */}
        {selectedAnalysis && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <AnalysisReport analysis={selectedAnalysis} language={language} />
          </div>
        )}
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(20, 184, 166, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(20, 184, 166, 0.6); }
      `}</style>
    </div>
  )
}