'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { toast } from 'sonner'

type PublishWordPressButtonProps = {
  analysis: {
    url: string
    niche: string
    content_strategy: string
  }
}

export function PublishWordPressButton({ analysis }: PublishWordPressButtonProps) {
  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublish = async () => {
    setIsPublishing(true)

    try {
      const title = `SEO Strategy & Analysis for ${analysis.url}`
      
      const content = `
        <h2>Website: <a href="${analysis.url}" target="_blank">${analysis.url}</a></h2>
        <p><strong>Niche:</strong> ${analysis.niche}</p>
        <hr />
        <h3>🤖 AI-Generated Content Strategy</h3>
        <p>${analysis.content_strategy || 'No content strategy available.'}</p>
        <p><em>Generated automatically by SEOMind AI</em></p>
      `

      const response = await fetch('/api/publish-wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      const data = await response.json()

      if (response.ok) {
        // ✅ إظهار إشعار النجاح مع زر لفتح المقال
        toast.success('Published to WordPress!', {
          description: 'Your article is now live.',
          action: {
            label: 'View',
            onClick: () => window.open(data.postUrl, '_blank'),
          },
        })
      } else {
        toast.error('Publishing failed', {
          description: data.error || 'Please check your WordPress connection.',
        })
      }
    } catch (error) {
      toast.error('An error occurred', {
        description: 'Failed to connect to the publishing service.',
      })
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <button
      onClick={handlePublish}
      disabled={isPublishing}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
  )
}