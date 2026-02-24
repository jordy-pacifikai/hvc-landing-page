import { NextRequest, NextResponse } from 'next/server'
import { getSessionWithPremium as getSession } from '@/app/lib/session'
import { getChannelBySlug, getForumPosts, createForumPostDb, getChannelById, canAccessChannel } from '@/app/lib/community-server'
import { rateLimit } from '@/app/lib/rate-limit'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const cursor = searchParams.get('cursor') || undefined

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
  }

  const channelResult = await getChannelBySlug(slug)
  if (channelResult.error || !channelResult.data) {
    return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
  }

  const channel = channelResult.data as { id: string; min_role?: string }
  if (!canAccessChannel(session.role, channel.min_role || 'member')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const result = await getForumPosts(channel.id, 20, cursor)

  const posts = (result.data || []) as Array<Record<string, unknown>>
  return NextResponse.json({ posts, hasMore: posts.length === 20 })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limit: 5 posts per minute
  const rl = rateLimit(`forum:${session.userId}`, 5, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ error: 'Trop de posts. Reessaie dans quelques secondes.' }, { status: 429 })
  }

  const { channelId, title, content } = await request.json()
  if (!channelId || !title || !content) {
    return NextResponse.json({ error: 'Missing channelId, title, or content' }, { status: 400 })
  }

  // Verify access
  const channelResult = await getChannelById(channelId)
  if (channelResult.error || !channelResult.data) {
    return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
  }
  if (!canAccessChannel(session.role, channelResult.data.min_role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const result = await createForumPostDb(channelId, session.userId, title, content)
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json(result.data)
}
