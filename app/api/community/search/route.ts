import { NextRequest, NextResponse } from 'next/server'
import { getSessionWithPremium as getSession } from '@/app/lib/session'
import { searchMessages, searchForumPosts, getChannels, canAccessChannel } from '@/app/lib/community-server'
import { rateLimit } from '@/app/lib/rate-limit'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limit: 30 searches per minute
  const rl = rateLimit(`search:${session.userId}`, 30, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ error: 'Trop de recherches. Reessaie dans quelques secondes.' }, { status: 429 })
  }

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ messages: [], posts: [] })
  }

  const [messages, posts, channelsResult] = await Promise.all([
    searchMessages(q),
    searchForumPosts(q),
    getChannels(),
  ])

  // Build set of accessible channel IDs based on user role
  const accessibleChannelIds = new Set(
    (channelsResult.data || [])
      .filter((ch) => canAccessChannel(session.role, ch.min_role))
      .map((ch) => ch.id)
  )

  const msgList = (messages.data || []) as Array<{ channel_id?: string }>
  const postList = (posts.data || []) as Array<{ channel_id?: string }>

  return NextResponse.json({
    messages: msgList.filter((m) => accessibleChannelIds.has(m.channel_id || '')),
    posts: postList.filter((p) => accessibleChannelIds.has(p.channel_id || '')),
  })
}
