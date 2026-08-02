'use client'

import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/i18n'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

type ExportPdfButtonProps = {
  analysis: {
    url: string
    niche: string
    location: string
    seo_score: number
    issues: string[]
    recommendations: string[]
    keywords: string[]
    content_strategy: string
    competitor_insights: string
    created_at: string
  }
}

export function ExportPdfButton({ analysis }: ExportPdfButtonProps) {
  const { t } = useTranslation()

  const handleExport = async () => {
    try {
      const tempDiv = document.createElement('div')
      tempDiv.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: 800px;
        padding: 40px;
        background: white;
        font-family: 'Arial', sans-serif;
        direction: rtl;
        text-align: right;
      `
      
      const scoreColor = analysis.seo_score >= 80 ? '#0d9488' : analysis.seo_score >= 60 ? '#eab308' : '#ef4444'
      const scoreText = analysis.seo_score >= 80 ? t('dashboard.report.excellent') : analysis.seo_score >= 60 ? t('dashboard.report.good') : t('dashboard.report.needsImprovement')
      
      tempDiv.innerHTML = `
        <div style="background: #0d9488; padding: 30px; margin: -40px -40px 30px -40px; color: white;">
          <h1 style="margin: 0; font-size: 32px; color: white;">SEOMind AI</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; color: white;">${t('dashboard.report.title')}</p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 30px;">
          ${t('dashboard.report.analyzedOn')}: ${new Date(analysis.created_at).toLocaleDateString('ar-EG')}
        </p>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #0d9488; font-size: 20px; margin-bottom: 15px;">${t('dashboard.report.website')}</h2>
          <p style="margin: 5px 0; color: #1f2937;"><strong style="color: #1f2937;">URL:</strong> <span style="color: #1f2937;">${analysis.url}</span></p>
          <p style="margin: 5px 0; color: #1f2937;"><strong style="color: #1f2937;">${t('dashboard.report.niche')}:</strong> <span style="color: #1f2937;">${analysis.niche}</span></p>
          <p style="margin: 5px 0; color: #1f2937;"><strong style="color: #1f2937;">${t('dashboard.report.location')}:</strong> <span style="color: #1f2937;">${analysis.location}</span></p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #0d9488; font-size: 20px; margin-bottom: 15px;">${t('dashboard.report.seoScore')}</h2>
          <div style="display: flex; align-items: center; gap: 20px;">
            <div style="font-size: 48px; font-weight: bold; color: ${scoreColor};">${analysis.seo_score}/100</div>
            <div style="padding: 8px 16px; background: ${scoreColor}20; border: 1px solid ${scoreColor}; border-radius: 20px; color: ${scoreColor}; font-weight: bold;">
              ${scoreText}
            </div>
          </div>
        </div>
        
        ${analysis.issues && analysis.issues.length > 0 ? `
          <div style="margin-bottom: 30px;">
            <h2 style="color: #ef4444; font-size: 20px; margin-bottom: 15px;">${t('dashboard.report.criticalIssues')}</h2>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${analysis.issues.map((issue, i) => `
                <li style="padding: 12px; margin: 8px 0; background: #fef2f2; border-right: 4px solid #ef4444; border-radius: 6px; color: #1f2937; font-size: 15px; line-height: 1.6;">
                  <strong style="color: #ef4444;">${i + 1}.</strong> <span style="color: #1f2937;">${issue}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${analysis.recommendations && analysis.recommendations.length > 0 ? `
          <div style="margin-bottom: 30px;">
            <h2 style="color: #0d9488; font-size: 20px; margin-bottom: 15px;">${t('dashboard.report.recommendations')}</h2>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${analysis.recommendations.map((rec, i) => `
                <li style="padding: 12px; margin: 8px 0; background: #f0fdfa; border-right: 4px solid #0d9488; border-radius: 6px; color: #1f2937; font-size: 15px; line-height: 1.6;">
                  <strong style="color: #0d9488;">${i + 1}.</strong> <span style="color: #1f2937;">${rec}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${analysis.keywords && analysis.keywords.length > 0 ? `
          <div style="margin-bottom: 30px;">
            <h2 style="color: #9333ea; font-size: 20px; margin-bottom: 15px;">${t('dashboard.report.targetKeywords')}</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              ${analysis.keywords.map((keyword, i) => `
                <span style="padding: 8px 16px; background: #faf5ff; border: 1px solid #9333ea; border-radius: 20px; color: #6b21a8; font-size: 14px; font-weight: 500;">
                  ${keyword}
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        ${analysis.content_strategy ? `
          <div style="margin-bottom: 30px;">
            <h2 style="color: #eab308; font-size: 20px; margin-bottom: 15px;">${t('dashboard.report.contentStrategy')}</h2>
            <p style="line-height: 1.8; color: #1f2937; font-size: 15px;">${analysis.content_strategy}</p>
          </div>
        ` : ''}
        
        ${analysis.competitor_insights ? `
          <div style="margin-bottom: 30px;">
            <h2 style="color: #0d9488; font-size: 20px; margin-bottom: 15px;">${t('dashboard.report.competitorInsights')}</h2>
            <p style="line-height: 1.8; color: #1f2937; font-size: 15px;">${analysis.competitor_insights}</p>
          </div>
        ` : ''}
        
        <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
          Generated by SEOMind AI - seomind-ai.vercel.app
        </div>
      `
      
      document.body.appendChild(tempDiv)
      
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })
      
      document.body.removeChild(tempDiv)
      
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      let heightLeft = imgHeight
      let position = 0
      
      const imgData = canvas.toDataURL('image/png')
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      const cleanUrl = analysis.url.replace(/^https?:\/\//, '').replace(/\/$/, '')
      pdf.save(`seo-report-${cleanUrl}.pdf`)
      
      toast.success('Success', { description: 'PDF exported successfully.' })
    } catch (error) {
      console.error('PDF Export Error:', error)
      toast.error('Error', { description: 'Failed to export PDF.' })
    }
  }

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted hover:border-teal/50"
    >
      <Download className="h-4 w-4" />
      {t('dashboard.actions.exportPdf')}
    </button>
  )
}