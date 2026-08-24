'use client'

import { useState } from 'react'
import { 
  Download, Share2, Linkedin, FileText, CheckCircle, 
  AlertCircle, TrendingUp, Target, Calendar, ExternalLink,
  Copy, Check, Globe, MapPin, Briefcase
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { toast } from 'sonner'

interface AnalysisReportProps {
  analysis: any
}

export function AnalysisReport({ analysis }: AnalysisReportProps) {
  const { t, language } = useTranslation()
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
      // هنا هنستخدم مكتبة jsPDF أو html2pdf
      // للتبسيط، هنعمل window.print() حالياً
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
      {/* Header - رأس التقرير */}
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
          {/* زر PDF */}
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-card transition-colors disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">
              {isGeneratingPDF 
                ? (language === 'ar' ? 'جاري...' : 'Generating...')
                : (language === 'ar' ? 'PDF' : 'PDF')}
            </span>
          </button>

          {/* زر LinkedIn */}
          <button
            onClick={handlePublishToLinkedIn}
            disabled={isPublishing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20 transition-colors disabled:opacity-50"
          >
            <Linkedin className="h-4 w-4" />
            <span className="text-sm font-medium">
              {isPublishing 
                ? (language === 'ar' ? 'جاري...' : 'Publishing...')
                : 'LinkedIn'}
            </span>
          </button>

          {/* زر WordPress */}
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

      {/* SEO Score Card - بطاقة النتيجة */}
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

      {/* Issues - المشاكل المكتشفة */}
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
              {copiedSection === 'issues' 
                ? (language === 'ar' ? 'تم النسخ' : 'Copied')
                : (language === 'ar' ? 'نسخ' : 'Copy')}
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

      {/* Recommendations - التوصيات */}
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
              {copiedSection === 'recommendations' 
                ? (language === 'ar' ? 'تم النسخ' : 'Copied')
                : (language === 'ar' ? 'نسخ' : 'Copy')}
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

      {/* Keywords - الكلمات المفتاحية */}
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
              {copiedSection === 'keywords' 
                ? (language === 'ar' ? 'تم النسخ' : 'Copied')
                : (language === 'ar' ? 'نسخ' : 'Copy')}
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

      {/* 30-Day Plan - خطة 30 يوم */}
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
              {copiedSection === 'plan' 
                ? (language === 'ar' ? 'تم النسخ' : 'Copied')
                : (language === 'ar' ? 'نسخ' : 'Copy')}
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

      {/* Blog Post Titles - عناوين المقالات */}
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
              {copiedSection === 'titles' 
                ? (language === 'ar' ? 'تم النسخ' : 'Copied')
                : (language === 'ar' ? 'نسخ' : 'Copy')}
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

      {/* Competitor Insights - رؤى المنافسين */}
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

      {/* Content Strategy - استراتيجية المحتوى */}
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

      {/* Auto Execution Info - معلومات التنفيذ التلقائي */}
      {analysis.auto_execution_ready && (
        <div className="p-6 rounded-2xl border border-teal/20 bg-teal/5">
          <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-teal" />
            {language === 'ar' ? 'جاهز للتنفيذ التلقائي' : 'Ready for Auto-Execution'}
          </h3>
          <p className="text-sm text-foreground mb-3">
            {analysis.next_action}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handlePublishToLinkedIn}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0077b5] text-white text-sm font-medium hover:bg-[#0077b5]/90 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              {language === 'ar' ? 'نشر على LinkedIn' : 'Publish to LinkedIn'}
            </button>
            <button
              onClick={handlePublishToWordPress}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-500/90 transition-colors"
            >
              <FileText className="h-4 w-4" />
              {language === 'ar' ? 'نشر على WordPress' : 'Publish to WordPress'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}