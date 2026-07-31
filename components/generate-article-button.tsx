'use client'

import { useState } from 'react'
import { FileText, Send, Eye, X } from 'lucide-react'
import { toast } from 'sonner'

type GenerateArticleButtonProps = {
  analysis: {
    url: string
    niche: string
    keywords: string[]
    content_strategy: string
  }
}

export function GenerateArticleButton({ analysis }: GenerateArticleButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [generatedArticle, setGeneratedArticle] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    toast.info('AI is writing your article...', { description: 'This may take 10-15 seconds.' })

    try {
      const response = await fetch('/api/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: analysis.url,
          niche: analysis.niche,
          keywords: analysis.keywords,
          content_strategy: analysis.content_strategy,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setGeneratedArticle(data.article)
        setShowPreview(true)
        toast.success('Article generated successfully!', { description: 'Review it before publishing.' })
      } else {
        toast.error('Generation failed', { description: data.error })
      }
    } catch (error) {
      toast.error('An error occurred', { description: 'Failed to connect to AI service.' })
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePublish = async () => {
    if (!generatedArticle) return
    setIsPublishing(true)

    try {
      const title = `Complete SEO Guide: ${analysis.niche} for ${analysis.url.replace(/^https?:\/\//, '')}`
      
      const response = await fetch('/api/publish-wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: generatedArticle }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Published to WordPress!', {
          description: 'Your full article is now live.',
          action: { label: 'View', onClick: () => window.open(data.postUrl, '_blank') },
        })
        setShowPreview(false) // إغلاق المعاينة بعد النشر
      } else {
        toast.error('Publishing failed', { description: data.error })
      }
    } catch (error) {
      toast.error('An error occurred', { description: 'Failed to publish to WordPress.' })
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <>
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal to-purple px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal/20"
      >
        {isGenerating ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            AI is Writing...
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
            Generate Full Article
          </>
        )}
      </button>

      {/* نافذة المعاينة (Modal) */}
      {showPreview && generatedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl bg-card border border-border shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border p-4 bg-background/50">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Eye className="h-5 w-5 text-teal" /> Article Preview
              </h3>
              <button 
                onClick={() => setShowPreview(false)}
                className="rounded-full p-1 hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Modal Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 bg-background">
              <div 
                className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-teal"
                dangerouslySetInnerHTML={{ __html: generatedArticle }} 
              />
            </div>

            {/* Modal Footer */}
            <div className="border-t border-border p-4 bg-background/50 flex justify-end gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Publish to WordPress
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}