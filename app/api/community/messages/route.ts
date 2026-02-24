import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/app/lib/session'
import { getMessages, createMessage, deleteMessageById, getChannelBySlug, getChannelById, getMessageById, createNotification } from '@/app/lib/community-server'

const MAX_MESSAGE_LENGTH = 2000

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
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
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { channelId, content, replyTo, imageUrl } = body

  if (!channelId || (!content?.trim() && !imageUrl)) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Server-side message length validation
  if (content && content.trim().length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: `Message trop long (max ${MAX_MESSAGE_LENGTH} caractères)` }, { status: 400 })
  }

  // Server-side is_readonly check
  const { data: channel } = await getChannelById(channelId)
  if (channel?.is_readonly) {
    return NextResponse.json({ error: 'Channel is read-only' }, { status: 403 })
  }

  const { data, error } = await createMessage(
    channelId,
    session.userId,
    content?.trim() ?? '',
    replyTo,
    imageUrl
  )
  if (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }

  // Fire notification for replies (non-blocking — don't fail the message send)
  if (replyTo && data) {
    const { data: originalMsg } = await getMessageById(replyTo)
    if (originalMsg && originalMsg.user_id !== session.userId) {
      // Don't await — notification failure shouldn't block the response
      createNotification(
        originalMsg.user_id,
        session.userId,
        'reply',
        channelId,
        (data as { id?: string }).id
      ).catch(e => console.warn('[community] notification failed (non-fatal):', e))
    }
  }

  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const messageId = req.nextUrl.searchParams.get('id')
  if (!messageId) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  // Verify ownership: only author or moderator/admin can delete
  const { data: message } = await getMessageById(messageId)
  if (!message) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 })
  }

  const isAuthor = message.user_id === session.userId
  const isModerator = session.role === 'admin' || session.role === 'moderator'

  if (!isAuthor && !isModerator) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await deleteMessageById(messageId)
  if (error) {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
