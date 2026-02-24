import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/app/lib/session'
import { getChannelBySlug, getForumPosts, createForumPostDb } from '@/app/lib/community-server'

export async function GET(request: NextRequest) {
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

  const channel = channelResult.data as { id: string }
  const result = await getForumPosts(channel.id, 20, cursor)

  const posts = (result.data || []) as Array<Record<string, unknown>>
  return NextResponse.json({ posts, hasMore: posts.length === 20 })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { channelId, title, content } = await request.json()
  if (!channelId || !title || !content) {
    return NextResponse.json({ error: 'Missing channelId, title, or content' }, { status: 400 })
  }

  const result = await createForumPostDb(channelId, session.userId, title, content)
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json(result.data)
}
