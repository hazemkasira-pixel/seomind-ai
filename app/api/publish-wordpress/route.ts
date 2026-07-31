import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server' // ✅ استيراد auth من Clerk

export async function POST(request: NextRequest) {
  try {
    // 1. التحقق من أن المستخدم مسجل دخول
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to publish.' },
        { status: 401 }
      )
    }

    const { title, content } = await request.json()

    const wpUrl = process.env.WORDPRESS_URL
    const username = process.env.WORDPRESS_USERNAME
    const password = process.env.WORDPRESS_APP_PASSWORD?.replace(/\s/g, '')

    if (!wpUrl || !username || !password) {
      return NextResponse.json(
        { error: 'WordPress credentials not configured' },
        { status: 500 }
      )
    }

    // إنشاء Basic Auth Header
    const credentials = Buffer.from(`${username}:${password}`).toString('base64')

    const response = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title || 'SEO Analysis Report',
        content: content || 'No content provided.',
        status: 'publish',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('WordPress API Error:', errorData)
      return NextResponse.json(
        { error: 'Failed to publish to WordPress', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({ success: true, postUrl: data.link })

  } catch (error) {
    console.error('Publish to WordPress error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}