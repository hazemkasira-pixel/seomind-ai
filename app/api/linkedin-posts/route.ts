import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const user = await currentUser()
    
    // 🔍 سجل تتبع لمعرفة هل المستخدم مسجل دخول أم لا
    console.log('🔍 API Check: Current User ID =', user ? user.id : 'NO USER FOUND')

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('linkedin_posts')
      .select(`
        *,
        analyses:article_id (
          blog_post_titles
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Supabase Error:', error)
      return NextResponse.json({ error: 'Failed to fetch posts', details: error.message }, { status: 500 })
    }

    console.log('✅ Successfully fetched', data?.length || 0, 'LinkedIn posts')
    return NextResponse.json({ data })
    
  } catch (error: any) {
    console.error('❌ API Route Crash:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}