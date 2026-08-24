'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Copy, CheckCircle, AlertCircle } from 'lucide-react' // ✅ تم إزالة Linkedin من هنا
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

interface LinkedInPost {
  id: string
  content: string
  created_at: string
  published: boolean
  linkedin_url?: string
}

export function LinkedInPostsWidget() {
  const { t } = useTranslation()
  const [posts, setPosts] = useState<LinkedInPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/linkedin-posts')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 404 || errorData.error?.includes('no account')) {
          setError('no_account')
        } else {
          setError('fetch_failed')
        }
        return
      }
      
      const result = await response.json()
      setPosts(result.data || [])
    } catch (err) {
      console.error('Failed to fetch posts:', err)
      setError('fetch_failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleCopy = async (post: LinkedInPost) => {
    try {
      await navigator.clipboard.writeText(post.content)
      setCopiedId(post.id)
      toast.success('تم نسخ المنشور!')
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      toast.error('فشل في النسخ')
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card/50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal/10">
          <LinkedinIcon className="h-6 w-6 text-teal animate-pulse" />
        </div>
        <p className="text-sm text-muted-foreground">جاري تحميل المنشورات...</p>
      </div>
    )
  }

  if (error === 'no_account') {
    return (
      <div className="rounded-2xl border border-[#0077b5]/20 bg-[#0077b5]/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0077b5]/10">
          <LinkedinIcon className="h-6 w-6 text-[#0077b5]" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">لم يتم ربط حساب LinkedIn بعد</h3>
        <p className="text-sm text-muted-foreground mb-4">اربط حسابك على LinkedIn من الشريط الجانبي لبدء توليد ونشر المنشورات تلقائياً.</p>
        <a
          href={`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent('http://localhost:3000/api/linkedin/callback')}&scope=w_member_social,openid,profile,email`}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0077b5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#006399] transition-colors"
        >
          <LinkedinIcon className="h-4 w-4" />
          ربط حساب LinkedIn الآن
        </a>
      </div>
    )
  }

  if (error === 'fetch_failed') {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">فشل في تحميل المنشورات</h3>
        <p className="text-sm text-muted-foreground mb-4">حدث خطأ أثناء جلب المنشورات. يرجى المحاولة مرة أخرى.</p>
        <button onClick={fetchPosts} className="inline-flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white hover:bg-teal/90 transition-colors">
          إعادة المحاولة
        </button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card/50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <LinkedinIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">لا توجد منشورات بعد</h3>
        <p className="text-sm text-muted-foreground">سيتم توليد منشورات LinkedIn تلقائياً عند إجراء تحليل جديد.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="rounded-2xl border border-border bg-card/50 p-6 hover:bg-card/80 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${post.published ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-xs font-medium text-muted-foreground">
                {post.published ? 'تم النشر' : 'بانتظار النشر'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{post.content}</p>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-border/50">
            <button
              onClick={() => handleCopy(post)}
              className="inline-flex items-center gap-2 rounded-lg bg-teal/10 px-3 py-1.5 text-xs font-medium text-teal hover:bg-teal/20 transition-colors"
            >
              {copiedId === post.id ? (
                <><CheckCircle className="h-3 w-3" /> تم النسخ</>
              ) : (
                <><Copy className="h-3 w-3" /> نسخ النص</>
              )}
            </button>

            {post.linkedin_url && (
              <a
                href={post.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#0077b5]/10 px-3 py-1.5 text-xs font-medium text-[#0077b5] hover:bg-[#0077b5]/20 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                عرض على LinkedIn
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}