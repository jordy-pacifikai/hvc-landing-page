import { NextRequest, NextResponse } from 'next/server'
import { getSessionWithPremium as getSession } from '@/app/lib/session'
import { getMessages, getReactions, createMessage, deleteMessageById, updateMessageContent, getChannelBySlug, getChannelById, getMessageById, createNotification, canAccessChannel } from '@/app/lib/community-server'
import { rateLimit } from '@/app/lib/rate-limit'

const MAX_MESSAGE_LENGTH = 2000

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const slug = req.nextUrl.searchParams.get('slug')
  const cursor = req.nextUrl.searchParams.get('cursor') || undefined
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '30') || 30, 100)

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
  }

  const { data: channel } = await getChannelBySlug(slug)
  if (!channel) {
    return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
  }

  if (!canAccessChannel(session.role, (channel as { min_role: string }).min_role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: messages, error } = await getMessages((channel as { id: string }).id, limit, cursor)
  if (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }

  // Enrich messages with reactions
  const msgList = messages || []
  const messageIds = msgList.map((m) => (m as { id: string }).id)
  const { data: allReactions } = await getReactions(messageIds)

  // Group reactions by message_id, aggregate by emoji, include has_reacted for current user
  const reactionMap = new Map<string, Array<{ emoji: string; count: number; has_reacted: boolean }>>()
  for (const r of (allReactions || []) as Array<{ message_id: string; user_id: string; emoji: string }>) {
    if (!reactionMap.has(r.message_id)) reactionMap.set(r.message_id, [])
    const list = reactionMap.get(r.message_id)!
    const existing = list.find((e) => e.emoji === r.emoji)
    if (existing) {
      existing.count++
      if (r.user_id === session.userId) existing.has_reacted = true
    } else {
      list.push({ emoji: r.emoji, count: 1, has_reacted: r.user_id === session.userId })
    }
  }

  const enriched = msgList.map((m) => ({
    ...m,
    reactions: reactionMap.get((m as { id: string }).id) || [],
  }))

  return NextResponse.json({
    messages: enriched,
    hasMore: msgList.length === limit,
  })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  console.log('[community/messages POST] session:', { userId: session.userId, isPremium: session.isPremium, role: session.role })
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limit: 30 messages per minute
  const rl = rateLimit(`msg:${session.userId}`, 30, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ error: 'Trop de messages. Reessaie dans quelques secondes.' }, { status: 429 })
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

  // Server-side is_readonly + min_role check
  const { data: channel } = await getChannelById(channelId)
  if (!canAccessChannel(session.role, channel?.min_role || 'member')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
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
    console.error('[community/messages POST] createMessage error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }

  // PostgREST returns an array with Prefer: return=representation — extract first item
  const message = Array.isArray(data) ? data[0] : data
  if (!message) {
    console.error('[community/messages POST] no message returned from createMessage')
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
  }

  // Fire notification for replies (non-blocking — don't fail the message send)
  if (replyTo) {
    const { data: originalMsg } = await getMessageById(replyTo)
    if (originalMsg && originalMsg.user_id !== session.userId) {
      createNotification(
        originalMsg.user_id,
        session.userId,
        'reply',
        channelId,
        (message as { id?: string }).id
      ).catch(e => console.warn('[community] notification failed (non-fatal):', e))
    }
  }

  return NextResponse.json(message)
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { messageId, content } = await req.json()
  if (!messageId || !content?.trim()) {
    return NextResponse.json({ error: 'Missing messageId or content' }, { status: 400 })
  }

  if (content.trim().length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: `Message trop long (max ${MAX_MESSAGE_LENGTH} caractères)` }, { status: 400 })
  }

  // Only the author can edit
  const { data: message } = await getMessageById(messageId)
  if (!message) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 })
  }
  if (message.user_id !== session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await updateMessageContent(messageId, content.trim())
  if (error) {
    return NextResponse.json({ error: 'Failed to edit message' }, { status: 500 })
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
