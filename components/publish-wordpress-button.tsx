'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

type PublishWordPressButtonProps = {
  analysis: {
    url: string
    niche: string
    content_strategy: string
  }
}

export function PublishWordPressButton({ analysis }: PublishWordPressButtonProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handlePublish = async () => {
    setIsPublishing(true)
    setMessage(null)

    try {
      const title = `SEO Strategy & Analysis for ${analysis.url}`
      
      // تنسيق المحتوى عشان يظهر بشكل جميل في WordPress
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
        setMessage({
          type: 'success',
          text: `Published successfully! <a href="${data.postUrl}" target="_blank" class="underline font-bold">View Post on WordPress</a>`,
        })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to publish' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while publishing' })
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="space-y-2">
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
      
      {message && (
        <p
          className={`text-xs ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}
          dangerouslySetInnerHTML={{ __html: message.text }}
        />
      )}
    </div>
  )
}