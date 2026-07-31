import { currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import dynamic from 'next/dynamic' // ✅ استيراد dynamic للتحسين
import { 
  LayoutDashboard, Globe, FileText, TrendingUp, Settings, 
  Plus, ArrowLeft, Search, AlertCircle, CheckCircle, 
  Target, Lightbulb, BarChart3, ExternalLink
} from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { PublishWordPressButton } from '@/components/publish-wordpress-button'

// ✅ التحميل الكسول (Lazy Loading) لزر الـ PDF لتحسين سرعة الصفحة
const ExportPdfButton = dynamic(
  () => import('@/components/export-pdf-button'),
  { ssr: false }
)

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ analysis?: string }>
}) {
  const user = await currentUser()
  const resolvedSearchParams = await searchParams
  const analysisId = resolvedSearchParams?.analysis

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Please log in to view your dashboard.</p>
      </div>
    )
  }

  // جلب كل التحليلات الخاصة بالمستخدم
  const { data: analyses, error } = await supabaseAdmin
    .from('analyses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching analyses:', error)
  }

  // تحديد التحليل المعروض (إما من الرابط أو أحدث تحليل)
  const selectedAnalysis = analysisId 
    ? analyses?.find((a: any) => a.id.toString() === analysisId)
    : analyses?.[0]

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
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href="#" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground">
            <Globe className="h-5 w-5" /> Projects
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
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome back, {user.firstName || user.username || 'User'}! 👋</h1>
              <p className="text-muted-foreground">Here's what's happening with your SEO today.</p>
            </div>
          </div>
          <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal to-purple px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:scale-105">
            <Plus className="h-4 w-4" /> New Analysis
          </Link>
        </header>

        {/* --- قسم سجل التحليلات السابقة --- */}
        {analyses && analyses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal" /> Recent Analyses
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
                        {new Date(analysis.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-teal transition-colors" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* --- قسم التقرير التفصيلي --- */}
        {selectedAnalysis ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* ✅ هنا تم إضافة أزرار تصدير الـ PDF والنشر على WordPress جنب بعض */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground">Detailed Report</h2>
                <span className="text-xs text-muted-foreground bg-border px-2 py-1 rounded">
                  {selectedAnalysis.url.replace(/^https?:\/\//, '')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <PublishWordPressButton analysis={selectedAnalysis} />
                <ExportPdfButton analysis={selectedAnalysis} />
              </div>
            </div>

            {/* SEO Score Card */}
            <div className="rounded-2xl border border-border bg-card/50 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h3 className="text-xl font-bold text-foreground">SEO Health Score</h3>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${getScoreBg(selectedAnalysis.seo_score)}`}>
                  {selectedAnalysis.seo_score >= 80 ? 'Excellent' : selectedAnalysis.seo_score >= 60 ? 'Good' : 'Needs Improvement'}
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
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Website</p>
                      <p className="font-semibold text-foreground truncate mt-1">{selectedAnalysis.url}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-background/60 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Niche</p>
                      <p className="font-semibold text-foreground mt-1">{selectedAnalysis.niche}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-background/60 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                      <p className="font-semibold text-foreground mt-1">{selectedAnalysis.location}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-background/60 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Analyzed On</p>
                      <p className="font-semibold text-foreground mt-1">{new Date(selectedAnalysis.created_at).toLocaleDateString()}</p>
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
                  <h3 className="text-lg font-bold text-foreground">Critical Issues</h3>
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
                  <h3 className="text-lg font-bold text-foreground">Recommendations</h3>
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
                <h3 className="text-lg font-bold text-foreground">Target Keywords</h3>
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
                  <h3 className="text-lg font-bold text-foreground">Content Strategy</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedAnalysis.content_strategy || 'No content strategy available.'}</p>
              </div>

              <div className="rounded-2xl border border-border bg-card/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="h-6 w-6 text-teal" />
                  <h3 className="text-lg font-bold text-foreground">Competitor Insights</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedAnalysis.competitor_insights || 'No competitor insights available.'}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card/50 p-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal/10">
              <Search className="h-10 w-10 text-teal" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No analyses yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              You haven't run any SEO analyses yet. Start by analyzing your first website to get actionable insights.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal to-purple px-8 py-3 text-base font-semibold text-white shadow-lg shadow-teal/20 transition-all hover:scale-105">
              <Plus className="h-5 w-5" /> Analyze Your First Website
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}