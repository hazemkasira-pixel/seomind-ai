'use client'

import type React from 'react'
import { useState } from 'react'
import { ArrowRight, Sparkles, Zap, Loader2, Globe, Briefcase, MapPin, AlertCircle, Target, User, Building2, Award, BriefcaseBusiness, TrendingUp } from 'lucide-react'
import { CustomSelect } from './custom-select'
import { nicheGroups, countries } from '@/lib/select-data'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import { createClient } from '@/lib/supabase-client'

const careerGoals = [
  { value: 'thought_leadership', label: 'Thought Leadership', labelAr: 'الريادة الفكرية' },
  { value: 'job_search', label: 'Job Search & Career Growth', labelAr: 'البحث عن عمل والنمو المهني' },
  { value: 'business_dev', label: 'Business Development', labelAr: 'تطوير الأعمال' },
  { value: 'content_creation', label: 'Content Creation', labelAr: 'صناعة المحتوى' },
  { value: 'networking', label: 'Professional Networking', labelAr: 'التواصل المهني' },
  { value: 'personal_branding', label: 'Personal Branding', labelAr: 'بناء العلامة الشخصية' },
]

const experienceOptions = [
  { value: '0-1', label: 'Less than 1 year', labelAr: 'أقل من سنة' },
  { value: '1-3', label: '1-3 years', labelAr: '1-3 سنوات' },
  { value: '3-5', label: '3-5 years', labelAr: '3-5 سنوات' },
  { value: '5-10', label: '5-10 years', labelAr: '5-10 سنوات' },
  { value: '10+', label: '10+ years', labelAr: 'أكثر من 10 سنوات' },
]

export function HeroSection() {
  const router = useRouter()
  const { t, language } = useTranslation()
  const supabase = createClient()
  
  const [accountType, setAccountType] = useState<'personal' | 'company' | null>(null)
  
  const [url, setUrl] = useState('')
  const [niche, setNiche] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  
  // ✅ حالة مدن التغطية
  const [coverageCities, setCoverageCities] = useState<string[]>([])
  
  const [jobTitle, setJobTitle] = useState('')
  const [experience, setExperience] = useState('')
  const [selectedGoal, setSelectedGoal] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // ✅ دوال الترجمة
  const getTranslatedOptions = (items: any[]) => {
    return items.map((item: any) => ({
      value: item.value,
      label: language === 'ar' ? (item.labelAr || item.label) : item.label
    }))
  }

  const getTranslatedGroups = (groups: any[]) => {
    return groups.map((group: any) => ({
      label: language === 'ar' ? (group.labelAr || group.label) : group.label,
      options: getTranslatedOptions(group.options)
    }))
  }

  // ✅ استخدام البيانات مباشرة من select-data.ts
  const translatedNicheGroups = getTranslatedGroups(nicheGroups)
  const translatedCountries = getTranslatedOptions(countries)
  const translatedCareerGoals = getTranslatedOptions(careerGoals)
  const translatedExperienceOptions = getTranslatedOptions(experienceOptions)

  const selectedCountryData = countries.find(c => c.value === selectedCountry)

  const handleAccountSelection = (type: 'personal' | 'company') => {
    setAccountType(type)
    setError('')
    setNiche('')
  }

  const toggleCoverageCity = (cityValue: string) => {
    setCoverageCities(prev => 
      prev.includes(cityValue) 
        ? prev.filter(c => c !== cityValue) 
        : [...prev, cityValue]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!accountType) {
      setError('يرجى اختيار نوع الحساب أولاً')
      return
    }

    if (!url || !niche || !selectedCountry) {
      setError(t('hero.form.error'))
      return
    }

    const cityLabel = selectedCountryData?.cities?.find((c: any) => c.value === selectedCity)?.label || selectedCity
    const finalLocation = selectedCity 
      ? `${selectedCountryData?.label}, ${cityLabel}` 
      : (selectedCountryData ? selectedCountryData.label : selectedCountry)

    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('profiles')
          .update({ 
            account_type: accountType,
            ...(accountType === 'personal' && {
              job_title: jobTitle,
              years_experience: experience,
              career_goal: selectedGoal,
            })
          })
          .eq('id', user.id)
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url, 
          niche, 
          location: finalLocation, 
          coverageCities, // ✅ إرسال مدن التغطية
          accountType,
          ...(accountType === 'personal' && {
            jobTitle,
            experience,
            careerGoal: selectedGoal,
          })
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Something went wrong')

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
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background via-background to-teal/5" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 h-[600px] w-[800px] max-w-[90vw] rounded-full bg-teal/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/5 px-4 py-1.5 text-sm font-medium text-teal mb-6">
            <Sparkles className="h-4 w-4" />
            {t('hero.badge')}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
            {t('hero.title1')}{' '}
            <span className="bg-gradient-to-r from-teal to-purple bg-clip-text text-transparent">
              {t('hero.title2')}
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>

        <div className="glow-border rounded-3xl p-6 md:p-8 lg:p-10 bg-card/80 backdrop-blur-xl border border-border/50">
          {error && (
            <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {!accountType && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground text-center mb-8">
                {language === 'ar' ? 'ماذا يصفك بشكل أفضل؟' : 'What best describes you?'}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => handleAccountSelection('personal')}
                  className="group p-8 rounded-2xl border-2 border-border hover:border-teal/50 bg-card/50 hover:bg-card transition-all text-left"
                >
                  <div className="h-16 w-16 rounded-xl bg-teal/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <User className="h-8 w-8 text-teal" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {language === 'ar' ? 'علامة تجارية شخصية / فرد' : 'Personal Brand / Individual'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {language === 'ar' 
                      ? 'أريد بناء علامتي التجارية الشخصية، وتعزيز تواجدي على لينكدإن، والنمو كمحترف أو صانع محتوى.'
                      : 'I want to build my personal brand, grow my LinkedIn presence, and establish myself as a thought leader.'}
                  </p>
                  <div className="flex items-center text-teal font-semibold">
                    {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAccountSelection('company')}
                  className="group p-8 rounded-2xl border-2 border-border hover:border-purple/50 bg-card/50 hover:bg-card transition-all text-left"
                >
                  <div className="h-16 w-16 rounded-xl bg-purple/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Building2 className="h-8 w-8 text-purple" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {language === 'ar' ? 'شركة / نشاط تجاري' : 'Company / Business'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {language === 'ar'
                      ? 'أريد تعزيز التواجد الرقمي لشركتي، تحسين محركات البحث (SEO)، وأتمتة نشر المحتوى التسويقي.'
                      : 'I want to grow my company\'s online presence, improve SEO, and automate content marketing.'}
                  </p>
                  <div className="flex items-center text-purple font-semibold">
                    {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {accountType && (
            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="flex items-center justify-between mb-6">
                <button
                  type="button"
                  onClick={() => setAccountType(null)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  {language === 'ar' ? 'الرجوع لاختيار نوع الحساب' : 'Back to account type selection'}
                </button>

                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  accountType === 'personal' ? 'bg-teal/10 text-teal border border-teal/20' : 'bg-purple/10 text-purple border border-purple/20'
                }`}>
                  {accountType === 'personal' ? <User className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                  {accountType === 'personal' 
                    ? (language === 'ar' ? 'علامة تجارية شخصية' : 'Personal Brand')
                    : (language === 'ar' ? 'شركة / نشاط تجاري' : 'Company / Business')}
                </div>
              </div>

              {/* ✅ Card 1: المعلومات الأساسية */}
              <div className="rounded-2xl border border-border/50 bg-card/30 p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                  <div className="p-2 rounded-lg bg-teal/10">
                    <Globe className="h-5 w-5 text-teal" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {language === 'ar' ? 'معلومات أساسية عن وجودك الرقمي' : 'Essential information about your online presence'}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* الرابط */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Globe className="h-4 w-4 text-teal" />
                      {accountType === 'personal' 
                        ? (language === 'ar' ? 'رابط الملف الشخصي' : 'Online Presence')
                        : (language === 'ar' ? 'رابط الموقع' : 'Website URL')}
                    </label>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder={accountType === 'personal' 
                        ? (language === 'ar' ? 'linkedin.com/in/yourname أو portfolio.com' : 'linkedin.com/in/yourname or portfolio.com')
                        : (language === 'ar' ? 'https://yoursite.com' : 'https://yoursite.com')}
                      className="h-12 w-full rounded-xl border border-border bg-background/50 px-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-teal/50 focus:ring-2 focus:ring-teal/20"
                    />
                  </div>

                  {/* المجال (يسحب البيانات مباشرة من select-data.ts) */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Briefcase className="h-4 w-4 text-teal" />
                      {accountType === 'personal' 
                        ? (language === 'ar' ? 'مجال التخصص' : 'Professional Field')
                        : (language === 'ar' ? 'مجال النشاط التجاري' : 'Business Niche')}
                    </label>
                    <CustomSelect
                      value={niche}
                      onChange={setNiche}
                      placeholder={accountType === 'personal'
                        ? (language === 'ar' ? 'اختر مجال تخصصك' : 'Select your professional field')
                        : (language === 'ar' ? 'اختر مجال نشاطك التجاري' : 'Select your business niche')}
                      groups={translatedNicheGroups}
                      searchable={true}
                    />
                  </div>
                </div>

                {/* ✅ الدولة + المدينة في نفس الصف (بنفس التنسيق) */}
                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                  {/* حقل الدولة */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <MapPin className="h-4 w-4 text-teal" />
                      {language === 'ar' ? 'الدولة المستهدفة' : 'Target Country'}
                    </label>
                    <CustomSelect
                      value={selectedCountry}
                      onChange={(value) => {
                        setSelectedCountry(value)
                        setSelectedCity('')
                        setCoverageCities([])
                      }}
                      placeholder={language === 'ar' ? 'اختر الدولة المستهدفة' : 'Select target country'}
                      groups={[{ 
                        label: language === 'ar' ? 'الدول' : 'Countries', 
                        options: translatedCountries
                      }]}
                      searchable={true}
                    />
                  </div>

                  {/* ✅ حقل المدينة الأساسية - مع الإصلاح */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <MapPin className="h-4 w-4 text-purple" />
                      {language === 'ar' ? 'المدينة الأساسية' : 'Primary City'}
                      <span className="text-xs font-normal text-muted-foreground ml-1">
                        {language === 'ar' ? '(اختياري)' : '(Optional)'}
                      </span>
                    </label>
                    
                    {/* ✅ عرض المدن مباشرة إذا كانت الدولة محددة */}
                    {selectedCountry && selectedCountryData?.cities && selectedCountryData.cities.length > 0 ? (
                      <CustomSelect
                        value={selectedCity}
                        onChange={setSelectedCity}
                        placeholder={language === 'ar' ? 'اختر المدينة' : 'Select city'}
                        groups={[{ 
                          label: language === 'ar' ? 'المدن' : 'Cities', 
                          options: getTranslatedOptions(selectedCountryData.cities)
                        }]}
                        searchable={true}
                      />
                    ) : (
                      <div className="h-12 w-full rounded-xl border border-border bg-background/30 px-4 text-sm text-muted-foreground/60 flex items-center">
                        {language === 'ar' ? 'اختر الدولة أولاً' : 'Select country first'}
                      </div>
                    )}
                  </div>
                </div>

                {/* ✅ حقل مدن التغطية (اختياري - متعدد الاختيار) */}
                {selectedCountry && selectedCountryData?.cities && selectedCountryData.cities.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <MapPin className="h-4 w-4 text-teal" />
                      {language === 'ar' ? 'مدن التغطية' : 'Coverage Cities'}
                      <span className="text-xs font-normal text-muted-foreground ml-1">
                        {language === 'ar' ? '(اختياري - يمكنك اختيار أكثر من مدينة)' : '(Optional - Select multiple)'}
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedCountryData.cities.map((city: any) => {
                        const cityLabel = language === 'ar' ? (city.labelAr || city.label) : city.label
                        const isSelected = coverageCities.includes(city.value)
                        return (
                          <button
                            key={city.value}
                            type="button"
                            onClick={() => toggleCoverageCity(city.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-purple/10 border-purple/50 text-purple hover:bg-purple/20'
                                : 'bg-background/50 border-border text-muted-foreground hover:border-purple/30 hover:text-foreground'
                            }`}
                          >
                            {cityLabel}
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-purple" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* ✅ Card 2: المعلومات المهنية (Personal Brand فقط) */}
              {accountType === 'personal' && (
                <div className="rounded-2xl border border-teal/20 bg-gradient-to-br from-teal/5 via-transparent to-transparent p-6 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-teal/10">
                        <Award className="h-5 w-5 text-teal" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {language === 'ar' ? 'معلوماتك المهنية' : 'Professional Details'}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {language === 'ar' ? 'هذه المعلومات ستحسن جودة التحليل' : 'This information will improve analysis quality'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-3 py-1.5 rounded-full bg-teal/10 text-teal font-medium border border-teal/20">
                      {language === 'ar' ? 'مُحسّن للتحليل' : 'Enhanced Analysis'}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <BriefcaseBusiness className="h-4 w-4 text-teal" />
                        {language === 'ar' ? 'المسمى الوظيفي' : 'Job Title / Role'}
                      </label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder={language === 'ar' ? 'مثال: Marketing Manager, CEO, Freelancer' : 'e.g., Marketing Manager, CEO, Freelancer'}
                        className="h-12 w-full rounded-xl border border-border bg-background/50 px-4 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-teal/50 focus:ring-2 focus:ring-teal/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <TrendingUp className="h-4 w-4 text-teal" />
                        {language === 'ar' ? 'سنوات الخبرة' : 'Years of Experience'}
                      </label>
                      <CustomSelect
                        value={experience}
                        onChange={setExperience}
                        placeholder={language === 'ar' ? 'اختر...' : 'Select...'}
                        groups={[{ 
                          label: language === 'ar' ? 'الخبرة' : 'Experience', 
                          options: translatedExperienceOptions 
                        }]}
                        searchable={false}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Target className="h-4 w-4 text-teal" />
                      {language === 'ar' ? 'الهدف المهني الأساسي' : 'Primary Career Goal'}
                    </label>
                    <CustomSelect
                      value={selectedGoal}
                      onChange={setSelectedGoal}
                      placeholder={language === 'ar' ? 'اختر هدفك المهني' : 'Select your career goal'}
                      groups={[{ 
                        label: language === 'ar' ? 'الأهداف' : 'Goals', 
                        options: translatedCareerGoals 
                      }]}
                      searchable={false}
                    />
                  </div>
                </div>
              )}

              {/* زر الإرسال */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-teal via-teal/90 to-purple font-semibold text-white text-base shadow-lg shadow-teal/25 transition-all hover:scale-[1.02] hover:shadow-teal/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {language === 'ar' ? 'جاري التحليل...' : 'Analyzing...'}
                  </>
                ) : (
                  <>
                    {accountType === 'personal'
                      ? (language === 'ar' ? 'حلل ملفي الشخصي' : 'Analyze My Profile')
                      : (language === 'ar' ? 'حلل موقعي' : 'Analyze My Website')}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* المميزات + Powered by Groq */}
          <div className="mt-8 pt-8 border-t border-border/50">
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground mb-6 flex-wrap">
              <div className="flex items-center gap-2.5 group">
                <div className="p-1.5 rounded-lg bg-teal/10 group-hover:bg-teal/20 transition-colors">
                  <Zap className="h-4 w-4 text-teal" />
                </div>
                <span className="font-medium">{t('hero.features.instant')}</span>
              </div>
              <div className="w-px h-4 bg-border hidden sm:block" />
              <div className="flex items-center gap-2.5 group">
                <div className="p-1.5 rounded-lg bg-purple/10 group-hover:bg-purple/20 transition-colors">
                  <Sparkles className="h-4 w-4 text-purple" />
                </div>
                <span className="font-medium">{t('hero.features.ai')}</span>
              </div>
              <div className="w-px h-4 bg-border hidden sm:block" />
              <div className="flex items-center gap-2.5 group">
                <div className="p-1.5 rounded-lg bg-teal/10 group-hover:bg-teal/20 transition-colors">
                  <Globe className="h-4 w-4 text-teal" />
                </div>
                <span className="font-medium">{t('hero.features.local')}</span>
              </div>
            </div>

            <div className="flex justify-center">
              <a 
                href="https://groq.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 border border-orange-500/20 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 group"
              >
                <span className="text-xs font-medium text-muted-foreground">Powered by</span>
                <div className="h-px w-8 bg-gradient-to-r from-orange-500/50 to-transparent" />
                <img 
                  src="/images/groq-logo.svg" 
                  alt="Groq"
                  className="h-5 w-auto object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {t('hero.trusted')}
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