import { NextRequest, NextResponse } from 'next/server'
import { getSessionWithPremium as getSession } from '@/app/lib/session'
import { searchMessages, searchForumPosts } from '@/app/lib/community-server'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ messages: [], posts: [] })
  }

  const [messages, posts] = await Promise.all([
    searchMessages(q),
    searchForumPosts(q),
  ])

  return NextResponse.json({
    messages: messages.data || [],
    posts: posts.data || [],
  })
}
