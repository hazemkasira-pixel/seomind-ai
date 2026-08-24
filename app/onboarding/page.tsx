'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { User, Building2, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client' // تأكد من وجود هذا الملف أو استخدم @supabase/supabase-js مباشرة

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<'personal' | 'company' | null>(null)

  const handleSelection = async (accountType: 'personal' | 'company') => {
    if (!user) return
    
    setLoading(true)
    setSelectedType(accountType)

    try {
      const supabase = createClient()
      
      // تحديث نوع الحساب في جدول profiles
      const { error } = await supabase
        .from('profiles')
        .update({ 
          account_type: accountType,
          // يمكنك إضافة حقول أخرى هنا لاحقاً مثل company_name أو job_title
        })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating profile:', error)
        throw error
      }

      // توجيه المستخدم إلى لوحة التحكم بعد النجاح
      router.push('/dashboard')
      router.refresh() // تحديث البيانات في الخلفية
      
    } catch (error) {
      console.error('Failed to save onboarding data:', error)
      alert('حدث خطأ أثناء حفظ البيانات، يرجى المحاولة مرة أخرى.')
      setLoading(false)
      setSelectedType(null)
    }
  }

  // عرض تحميل حتى يتم تحميل بيانات المستخدم من Clerk
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-teal/10 mb-6">
            <CheckCircle2 className="h-8 w-8 text-teal" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            مرحباً بك في SEOMind AI! 👋
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            دعنا نخصص تجربتك لتناسب أهدافك تماماً. ماذا يصفك بشكل أفضل؟
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* خيار العلامة التجارية الشخصية */}
          <button
            onClick={() => handleSelection('personal')}
            disabled={loading}
            className={`group relative p-8 rounded-2xl border-2 text-left transition-all duration-300 ${
              selectedType === 'personal'
                ? 'border-teal bg-teal/5 ring-2 ring-teal/20'
                : 'border-border bg-card/50 hover:border-teal/50 hover:bg-card'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="h-16 w-16 rounded-xl bg-teal/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <User className="h-8 w-8 text-teal" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              علامة تجارية شخصية / فرد
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              أريد بناء علامتي التجارية الشخصية، وتعزيز تواجدي على لينكدإن، والنمو كمحترف أو صانع محتوى.
            </p>
            <div className="flex items-center text-teal font-semibold">
              ابدأ الآن 
              <ArrowRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* خيار الشركة / الأعمال */}
          <button
            onClick={() => handleSelection('company')}
            disabled={loading}
            className={`group relative p-8 rounded-2xl border-2 text-left transition-all duration-300 ${
              selectedType === 'company'
                ? 'border-purple bg-purple/5 ring-2 ring-purple/20'
                : 'border-border bg-card/50 hover:border-purple/50 hover:bg-card'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="h-16 w-16 rounded-xl bg-purple/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Building2 className="h-8 w-8 text-purple" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              شركة / نشاط تجاري
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              أريد تعزيز التواجد الرقمي لشركتي، تحسين محركات البحث (SEO)، وأتمتة نشر المحتوى التسويقي.
            </p>
            <div className="flex items-center text-purple font-semibold">
              ابدأ الآن 
              <ArrowRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

        </div>

        {/* Loading State Message */}
        {loading && (
          <div className="text-center mt-8 animate-in fade-in slide-in-from-bottom-2">
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري حفظ تفضيلاتك وتجهيز لوحة التحكم...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}