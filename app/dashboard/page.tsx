import { currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { DashboardView } from '@/components/dashboard-view'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ analysis?: string }>
}) {
  const user = await currentUser()
  
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Please log in to view your dashboard.</p>
      </div>
    )
  }

  const resolvedSearchParams = await searchParams
  const analysisId = resolvedSearchParams?.analysis

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

  // ✅ إنشاء كائن مستخدم مبسط (Plain Object) لتجنب خطأ التسلسل
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
    <DashboardView 
      user={simplifiedUser} 
      analyses={analyses} 
      selectedAnalysis={selectedAnalysis} 
    />
  )
}