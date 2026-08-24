import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('linkedin_accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching LinkedIn accounts:', error)
      return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 })
    }

    // إرجاع البيانات (مصفوفة فارغة إذا لم يكن هناك حساب مربوط)
    return NextResponse.json({ data: data || [] })
    
  } catch (error) {
    console.error('Error in GET /api/linkedin-accounts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}