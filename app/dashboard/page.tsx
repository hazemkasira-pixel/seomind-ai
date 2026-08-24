import { currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { DashboardView } from '@/components/dashboard-view'
import { LinkedInPostsWidget } from '@/components/linkedin-posts-widget'
import { redirect } from 'next/navigation'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ analysis?: string }>
}) {
  const user = await currentUser()
  
  if (!user) {
    redirect('/login')
  }

  const resolvedSearchParams = await searchParams
  const analysisId = resolvedSearchParams?.analysis

  // ✅ جلب البروفايل - لو مش موجود هننشئه مباشرة
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('account_type, company_name, job_title')
    .eq('id', user.id)
    .single()

  // ✅ لو مفيش بروفايل أو مفيش account_type، هنحط قيمة افتراضية
  if (!profile || !profile.account_type) {
    // إنشاء أو تحديث البروفايل بقيمة افتراضية
    await supabaseAdmin
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.emailAddresses?.[0]?.emailAddress || '',
        full_name: user.firstName || user.username || 'User',
        account_type: 'personal', // ✅ قيمة افتراضية
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      })
  }

  const { data: analyses, error } = await supabaseAdmin
    .from('analyses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching analyses:', error)
  }

  const selectedAnalysis = analysisId 
    ? analyses?.find((a: any) => a.id.toString() === analysisId)
    : analyses?.[0]

  const simplifiedUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    emailAddresses: user.emailAddresses?.map((email: any) => ({
      emailAddress: email.emailAddress
    })) || []
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardView 
        user={simplifiedUser} 
        analyses={analyses} 
        selectedAnalysis={selectedAnalysis}
        profile={{ account_type: 'personal' }} // ✅ تمرير قيمة افتراضية
      />
      
      <div className="container mx-auto px-4 md:px-8 pb-10">
        <section className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-[#0077b5]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </span>
                منشورات LinkedIn الجاهزة
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                يتم توليد منشور احترافي تلقائياً مع كل مقال جديد، جاهز للنسخ والنشر مباشرة.
              </p>
            </div>
          </div>
          
          <LinkedInPostsWidget />
        </section>
      </div>
    </div>
  )
}