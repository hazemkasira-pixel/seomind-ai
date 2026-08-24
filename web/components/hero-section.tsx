'use client'

import type React from 'react'
import { useState } from 'react'
import { ArrowRight, Sparkles, Zap, Loader2, Globe, Briefcase, MapPin, AlertCircle } from 'lucide-react'
import { CustomSelect } from '@/components/custom-select'
import { nicheGroups, countries } from '@/lib/select-data'
import { useRouter } from 'next/navigation'

export function HeroSection() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [niche, setNiche] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [location, setLocation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedCountryData = countries.find(c => c.value === selectedCountry)
  const cityOptions = selectedCountryData ? [{
    label: "Select City or Country-wide",
    options: selectedCountryData.cities
  }] : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!url || !niche || !selectedCountry) {
      setError('Please fill in the URL, Niche, and select at least a Country.')
      return
    }

    const finalLocation = location || (selectedCountryData ? selectedCountryData.label : selectedCountry)

    const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
    if (!urlPattern.test(url)) {
      setError('Please enter a valid URL (e.g., https://example.com or example.com)')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, niche, location: finalLocation }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      if (typeof window !== 'undefined' && data.data) {
        localStorage.setItem(`analysis_${data.analysisId}`, JSON.stringify(data.data))
      }

      router.push(`/dashboard?analysis=${data.analysisId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start analysis')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center py-20 px-4">
      {/* خلفية أنظف وأقل تشتيتاً */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background via-background to-teal/5"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 h-[600px] w-[800px] max-w-[90vw] rounded-full bg-teal/10 blur-[120px]"
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* Header Text */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/5 px-4 py-1.5 text-sm font-medium text-teal mb-6">
            <Sparkles className="h-4 w-4" />
            AI-Powered SEO Analysis
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
            Unlock Your Website's{' '}
            <span className="bg-gradient-to-r from-teal to-purple bg-clip-text text-transparent">
              Full Potential
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant, actionable SEO insights powered by advanced AI. 
            Analyze, optimize, and dominate your local market.
          </p>
        </div>

        {/* Form Container */}
        <div className="glow-border rounded-3xl p-6 md:p-8 lg:p-10 bg-card/80 backdrop-blur-xl border border-border/50">
          {error && (
            <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* الصف الأول: URL و Niche */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Globe className="h-4 w-4 text-teal" />
                  Website URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yoursite.com"
                  className="h-12 w-full rounded-xl border border-border bg-background/50 px-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-teal/50 focus:ring-2 focus:ring-teal/20"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Briefcase className="h-4 w-4 text-teal" />
                  Business Niche
                </label>
                <CustomSelect
                  value={niche}
                  onChange={setNiche}
                  placeholder="Select your business type"
                  groups={nicheGroups}
                  searchable={true}
                />
              </div>
            </div>

            {/* الصف الثاني: Location */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapPin className="h-4 w-4 text-teal" />
                  Target Location
                </label>
                <span className="text-xs text-muted-foreground">
                  City optional • Country-wide targeting available
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <CustomSelect
                  value={selectedCountry}
                  onChange={(value) => {
                    setSelectedCountry(value)
                    setLocation('')
                  }}
                  placeholder="Select Country"
                  groups={[{ label: "Countries", options: countries.map(c => ({ value: c.value, label: c.label })) }]}
                  searchable={true}
                />
                <CustomSelect
                  value={location}
                  onChange={setLocation}
                  placeholder={selectedCountry ? "Select city (optional)" : "Select country first"}
                  groups={cityOptions}
                  disabled={!selectedCountry}
                  searchable={true}
                />
              </div>
            </div>

            {/* زر التحليل */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full h-14 rounded-xl bg-gradient-to-r from-teal via-teal/90 to-purple font-semibold text-white text-base shadow-lg shadow-teal/25 transition-all hover:scale-[1.02] hover:shadow-teal/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing your website...
                </>
              ) : (
                <>
                  Analyze My Website
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-teal" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-teal" />
              <span>Local SEO Focus</span>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Trusted by businesses worldwide
          </p>
          <div className="flex items-center justify-center gap-8 opacity-50 grayscale">
            <div className="h-8 w-20 bg-muted rounded" />
            <div className="h-8 w-20 bg-muted rounded" />
            <div className="h-8 w-20 bg-muted rounded" />
            <div className="h-8 w-20 bg-muted rounded" />
          </div>
        </div>
      </div>
    </section>
  )
}
