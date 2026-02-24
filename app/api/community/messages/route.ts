import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/app/lib/session'
import { getMessages, createMessage, deleteMessageById, getChannelBySlug } from '@/app/lib/community-server'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const slug = req.nextUrl.searchParams.get('slug')
  const cursor = req.nextUrl.searchParams.get('cursor') || undefined
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '30')

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
  }

  const { data: channel } = await getChannelBySlug(slug)
  if (!channel) {
    return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
  }

  const { data: messages, error } = await getMessages((channel as { id: string }).id, limit, cursor)
  if (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }

  return NextResponse.json({
    messages: messages || [],
    hasMore: (messages || []).length === limit,
  })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { channelId, content, replyTo } = body

  if (!channelId || !content?.trim()) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { data, error } = await createMessage(channelId, session.userId, content.trim(), replyTo)
  if (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const messageId = req.nextUrl.searchParams.get('id')
  if (!messageId) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const { error } = await deleteMessageById(messageId)
  if (error) {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
