'use client'

import { useState } from 'react' // ✅ إضافة useState
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { 
  LayoutDashboard, Globe, FileText, Plus, ArrowLeft, Search, 
  AlertCircle, CheckCircle, Target, Lightbulb, BarChart3, ExternalLink,
  Send 
} from 'lucide-react'
import { GenerateArticleButton } from '@/components/generate-article-button'
import { ExportPdfButton } from '@/components/export-pdf-button'
import { useTranslation } from '@/lib/i18n'
import { toast } from 'sonner'

// ✅ مكون زر التنفيذ التلقائي
function AutoExecuteButton({ analysisId, nextAction, firstTitle }: { analysisId: string, nextAction: string, firstTitle?: string }) {
  const { t } = useTranslation()
  const [isExecuting, setIsExecuting] = useState(false)

  const handleExecute = async () => {
    setIsExecuting(true)
    toast.info('🚀 Starting Auto-Execution...', { 
      description: 'AI is generating and publishing the first suggested article...' 
    })

    try {
      const response = await fetch('/api/auto-execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('✅ Execution Successful!', {
          description: `Published: "${data.title}"`,
          action: { label: t('dashboard.view') || 'View', onClick: () => window.open(data.postUrl, '_blank') },
        })
      } else {
        toast.error('❌ Execution Failed', { description: data.error || data.details })
      }
    } catch (error) {
      toast.error('❌ Execution Failed', { description: 'Network error occurred.' })
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
          <Send className="h-5 w-5 text-teal" />
          Ready for Auto-Execution
        </h3>
        <p className="text-sm text-muted-foreground mb-2">{nextAction}</p>
        {firstTitle && (
          <p className="text-xs text-teal font-medium bg-teal/10 inline-block px-2 py-1 rounded">
            Next up: "{firstTitle}"
          </p>
        )}
      </div>
      <button
        onClick={handleExecute}
        disabled={isExecuting}
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal to-purple px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {isExecuting ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Executing...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Execute Plan Now
          </>
        )}
      </button>
    </div>
  )
}

export function DashboardView({ user, analyses, selectedAnalysis }: any) {
  const { t } = useTranslation()

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-teal'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-teal/10 border-teal/30 text-teal'
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
    return 'bg-red-500/10 border-red-500/30 text-red-500'
  }

  const getScoreText = (score: number) => {
    if (score >= 80) return t('dashboard.report.excellent')
    if (score >= 60) return t('dashboard.report.good')
    return t('dashboard.report.needsImprovement')
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border/60 bg-card/30 p-6 md:flex">
        <Link href="/" className="mb-10 flex items-center gap-2">
          <span className="text-xl font-bold text-white">SEO</span>
          <span className="text-xl font-bold text-teal">Mind</span>
        </Link>
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-lg bg-teal/10 px-4 py-3 text-sm font-medium text-teal">
            <LayoutDashboard className="h-5 w-5" /> {t('dashboard.sidebar.dashboard')}
          </Link>
          <Link href="#" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground">
            <Globe className="h-5 w-5" /> {t('dashboard.sidebar.projects')}
          </Link>
        </nav>
        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-3 rounded-lg px-4 py-3">
            <UserButton afterSignOutUrl="/" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.firstName || user.username || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user.emailAddresses?.[0]?.emailAddress}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> {t('dashboard.header.backHome')}
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t('dashboard.header.welcome')}, {user.firstName || user.username || 'User'}! 👋</h1>
              <p className="text-muted-foreground">{t('dashboard.header.subtitle')}</p>
            </div>
          </div>
          <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal to-purple px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:scale-105">
            <Plus className="h-4 w-4" /> {t('dashboard.header.newAnalysis')}
          </Link>
        </header>

        {/* Recent Analyses */}
        {analyses && analyses.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal" /> {t('dashboard.recentAnalyses.title')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {analyses.map((analysis: any) => {
                const cleanUrl = analysis.url.replace(/^https?:\/\//, '').replace(/\/$/, '')
                const isActive = selectedAnalysis?.id === analysis.id
                
                return (
                  <Link
                    key={analysis.id}
                    href={`/dashboard?analysis=${analysis.id}`}
                    className={`group rounded-xl border p-4 transition-all hover:scale-[1.02] ${
                      isActive 
                        ? 'border-teal bg-teal/5 ring-1 ring-teal/50' 
                        : 'border-border bg-card/50 hover:bg-card hover:border-teal/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground truncate max-w-[65%] group-hover:text-foreground transition-colors">
                        {cleanUrl}
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs font-bold border ${getScoreBg(analysis.seo_score)}`}>
                        {analysis.seo_score}/100
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground truncate mb-1">{analysis.niche}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">
                        {new Date(analysis.created_at).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-teal transition-colors" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card/50 p-12 text-center mb-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal/10">
              <Search className="h-10 w-10 text-teal" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{t('dashboard.recentAnalyses.noAnalyses')}</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {t('dashboard.recentAnalyses.noAnalysesDesc')}
            </p>
            <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal to-purple px-8 py-3 text-base font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:scale-105">
              <Plus className="h-5 w-5" /> {t('dashboard.recentAnalyses.analyzeFirst')}
            </Link>
          </div>
        )}

        {/* Detailed Report */}
        {selectedAnalysis && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">{t('dashboard.report.title')}</h2>
                <span className="text-xs text-muted-foreground bg-border px-2 py-1 rounded">
                  {selectedAnalysis.url.replace(/^https?:\/\//, '')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <GenerateArticleButton analysis={selectedAnalysis} />
                <ExportPdfButton analysis={selectedAnalysis} />
              </div>
            </div>

            {/* SEO Score Card */}
            <div className="rounded-2xl border border-border bg-card/50 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h3 className="text-xl font-bold text-foreground">{t('dashboard.report.seoScore')}</h3>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${getScoreBg(selectedAnalysis.seo_score)}`}>
                  {getScoreText(selectedAnalysis.seo_score)}
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-40 h-40 shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-border" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={`${(selectedAnalysis.seo_score / 100) * 440} 440`} className={`${getScoreColor(selectedAnalysis.seo_score)} transition-all duration-1000`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-4xl font-bold ${getScoreColor(selectedAnalysis.seo_score)}`}>{selectedAnalysis.seo_score}</span>
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-background/60 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('dashboard.report.website')}</p>
                      <p className="font-semibold text-foreground truncate mt-1">{selectedAnalysis.url}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-background/60 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('dashboard.report.niche')}</p>
                      <p className="font-semibold text-foreground mt-1">{selectedAnalysis.niche}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-background/60 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('dashboard.report.location')}</p>
                      <p className="font-semibold text-foreground mt-1">{selectedAnalysis.location}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-background/60 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('dashboard.report.analyzedOn')}</p>
                      <p className="font-semibold text-foreground mt-1">{new Date(selectedAnalysis.created_at).toLocaleDateString('ar-EG')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Issues & Recommendations */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border bg-card/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                  <h3 className="text-lg font-bold text-foreground">{t('dashboard.report.criticalIssues')}</h3>
                </div>
                <ul className="space-y-3">
                  {(selectedAnalysis.issues || []).map((issue: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-card/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="h-6 w-6 text-teal" />
                  <h3 className="text-lg font-bold text-foreground">{t('dashboard.report.recommendations')}</h3>
                </div>
                <ul className="space-y-3">
                  {(selectedAnalysis.recommendations || []).map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-teal/5 border border-teal/10">
                      <CheckCircle className="h-5 w-5 text-teal mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Keywords */}
            <div className="rounded-2xl border border-border bg-card/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Target className="h-6 w-6 text-purple" />
                <h3 className="text-lg font-bold text-foreground">{t('dashboard.report.targetKeywords')}</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {(selectedAnalysis.keywords || []).map((keyword: string, index: number) => (
                  <span key={index} className="px-4 py-2 rounded-full bg-purple/10 border border-purple/30 text-purple text-sm font-medium">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Strategy & Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border bg-card/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-lg font-bold text-foreground">{t('dashboard.report.contentStrategy')}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedAnalysis.content_strategy || t('dashboard.report.noContentStrategy')}</p>
              </div>

              <div className="rounded-2xl border border-border bg-card/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="h-6 w-6 text-teal" />
                  <h3 className="text-lg font-bold text-foreground">{t('dashboard.report.competitorInsights')}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedAnalysis.competitor_insights || t('dashboard.report.noCompetitorInsights')}</p>
              </div>
            </div>

            {/* ✅ قسم المنافسين المكتشفين تلقائياً */}
            {selectedAnalysis.discovered_competitors && selectedAnalysis.discovered_competitors.length > 0 && (
              <div className="rounded-2xl border border-border bg-card/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="h-6 w-6 text-red-500" />
                  <h3 className="text-lg font-bold text-foreground">Discovered Competitors</h3>
                  {selectedAnalysis.recommended_target && (
                    <span className="ml-auto text-xs bg-teal/10 text-teal px-3 py-1 rounded-full border border-teal/30">
                      Recommended Target: {selectedAnalysis.recommended_target}
                    </span>
                  )}
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedAnalysis.discovered_competitors.map((competitor: any, index: number) => (
                    <div key={index} className="p-4 rounded-xl bg-background/60 border border-border/50">
                      <h4 className="font-semibold text-foreground mb-2">{competitor.name || `Competitor ${index + 1}`}</h4>
                      <p className="text-xs text-teal mb-2">{competitor.domain}</p>
                      <p className="text-xs text-muted-foreground mb-1"><strong>Location:</strong> {competitor.location}</p>
                      <p className="text-xs text-green-600 mb-1"><strong>Strength:</strong> {competitor.strength}</p>
                      <p className="text-xs text-red-500"><strong>Weakness:</strong> {competitor.weakness}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ قسم خطة 30 يوم */}
            {selectedAnalysis.thirty_day_plan && selectedAnalysis.thirty_day_plan.length > 0 && (
              <div className="rounded-2xl border border-border bg-card/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="h-6 w-6 text-purple" />
                  <h3 className="text-lg font-bold text-foreground">30-Day Action Plan</h3>
                </div>
                <div className="space-y-3">
                  {selectedAnalysis.thirty_day_plan.map((step: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-purple/5 border border-purple/10">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple text-white text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-sm text-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ قسم عناوين المقالات المقترحة */}
            {selectedAnalysis.blog_post_titles && selectedAnalysis.blog_post_titles.length > 0 && (
              <div className="rounded-2xl border border-border bg-card/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="h-6 w-6 text-teal" />
                  <h3 className="text-lg font-bold text-foreground">Suggested Blog Post Titles</h3>
                </div>
                <div className="space-y-3">
                  {selectedAnalysis.blog_post_titles.map((title: string, index: number) => (
                    <div key={index} className="p-4 rounded-lg bg-teal/5 border border-teal/10">
                      <p className="text-sm font-medium text-foreground">{title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ زر التنفيذ التلقائي (محدث ليعمل فعلياً) */}
            {selectedAnalysis.auto_execution_ready && selectedAnalysis.blog_post_titles?.length > 0 && (
              <div className="rounded-2xl border border-teal/50 bg-teal/5 p-6">
                <AutoExecuteButton 
                  analysisId={selectedAnalysis.id} 
                  nextAction={selectedAnalysis.next_action} 
                  firstTitle={selectedAnalysis.blog_post_titles[0]} 
                />
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  )
}