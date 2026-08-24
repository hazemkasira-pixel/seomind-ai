'use client'

import { useState } from 'react'
import { 
  Download, FileText, CheckCircle, 
  AlertCircle, TrendingUp, Target, Calendar, ExternalLink,
  Globe, MapPin, Briefcase
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { toast } from 'sonner'

// ✅ أيقونة LinkedIn كـ SVG مباشر (بديل آمن)
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

interface AnalysisReportProps {
  analysis: any
  language: string
}

export function AnalysisReport({ analysis, language }: AnalysisReportProps) {
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

      {/* Competitors */}
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
              <div key={index} className="p-4 rounded-xl border border-border bg-background/50 hover:bg-card transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-500 font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        {competitor.name || competitor.domain}
                      </h4>
                      <a href={`https://${competitor.domain}`} target="_blank" rel="noopener noreferrer" className="text-xs text-teal hover:underline flex items-center gap-1">
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
          
          {analysis.recommended_target && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
              <p className="text-sm font-semibold text-foreground mb-1">
                {language === 'ar' ? '🎯 المنافس الأسهل للتفوق عليه:' : ' Easiest Competitor to Outrank:'}
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
            <button onClick={() => handleCopyToClipboard(analysis.issues.join('\n'), 'issues')} className="text-xs text-muted-foreground hover:text-foreground">
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
            <button onClick={() => handleCopyToClipboard(analysis.recommendations.join('\n'), 'recommendations')} className="text-xs text-muted-foreground hover:text-foreground">
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
            <button onClick={() => handleCopyToClipboard(analysis.keywords.join(', '), 'keywords')} className="text-xs text-muted-foreground hover:text-foreground">
              {copiedSection === 'keywords' ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ' : 'Copy')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.keywords.map((keyword: string, index: number) => (
              <span key={index} className="px-3 py-1.5 rounded-lg bg-purple/10 text-purple text-sm font-medium border border-purple/20">
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
            <button onClick={() => handleCopyToClipboard(analysis.thirty_day_plan.join('\n'), 'plan')} className="text-xs text-muted-foreground hover:text-foreground">
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
            <button onClick={() => handleCopyToClipboard(analysis.blog_post_titles.join('\n'), 'titles')} className="text-xs text-muted-foreground hover:text-foreground">
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
          <p className="text-sm text-foreground leading-relaxed">{analysis.competitor_insights}</p>
        </div>
      )}

      {/* Content Strategy */}
      {analysis.content_strategy && (
        <div className="p-6 rounded-2xl border border-border bg-card/50">
          <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-500" />
            {language === 'ar' ? 'استراتيجية المحتوى' : 'Content Strategy'}
          </h3>
          <p className="text-sm text-foreground leading-relaxed">{analysis.content_strategy}</p>
        </div>
      )}
    </div>
  )
}