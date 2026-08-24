import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      console.error('User not authenticated during LinkedIn callback')
      return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL))
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (error) {
      console.error('LinkedIn OAuth Error:', error, errorDescription)
      return NextResponse.redirect(new URL('/dashboard?error=linkedin_denied', process.env.NEXT_PUBLIC_APP_URL))
    }

    if (!code) {
      console.error('No code received from LinkedIn')
      return NextResponse.redirect(new URL('/dashboard?error=no_code', process.env.NEXT_PUBLIC_APP_URL))
    }

    // 1. تبادل الـ Code مع Access Token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/linkedin/callback`,
      }),
    })

    const tokenData = await tokenResponse.json()
    if (!tokenResponse.ok) {
      console.error('Failed to get access token:', tokenData)
      throw new Error(tokenData.error_description || 'Failed to get access token')
    }

    const { access_token, expires_in } = tokenData
    console.log('Access Token received successfully')

    // 2. جلب بيانات البروفايل من لينكدإن
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${access_token}` },
    })

    const profileData = await profileResponse.json()
    if (!profileResponse.ok) {
      console.error('Failed to get profile data:', profileData)
      throw new Error('Failed to get profile data')
    }

    console.log('Profile data received:', profileData)

    // 3. حفظ البيانات في Supabase
    const { error: dbError } = await supabaseAdmin.from('linkedin_accounts').upsert({
      user_id: user.id,
      account_type: 'personal', // يمكن تغييره لاحقاً بناءً على اختيار المستخدم
      account_name: profileData.name || 'LinkedIn Account',
      linkedin_id: profileData.sub,
      access_token: access_token,
      token_expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
      is_active: true,
      auto_publish: true,
    }, {
      onConflict: 'linkedin_id'
    })

    if (dbError) {
      console.error('Database error saving LinkedIn account:', dbError)
      throw new Error('Failed to save account to database')
    }

    console.log('LinkedIn account saved successfully!')

    // 4. توجيه المستخدم للداشبورد برسالة نجاح
    return NextResponse.redirect(new URL('/dashboard?success=linkedin_connected', process.env.NEXT_PUBLIC_APP_URL))

  } catch (error: any) {
    console.error('LinkedIn Callback Error:', error)
    return NextResponse.redirect(new URL('/dashboard?error=linkedin_failed', process.env.NEXT_PUBLIC_APP_URL))
  }
}