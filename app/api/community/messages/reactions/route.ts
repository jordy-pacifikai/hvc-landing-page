import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/app/lib/session'
import { addReactionDb, removeReactionDb } from '@/app/lib/community-server'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { messageId, emoji } = await request.json()
  if (!messageId || !emoji) {
    return NextResponse.json({ error: 'Missing messageId or emoji' }, { status: 400 })
  }

  const result = await addReactionDb(messageId, session.userId, emoji)
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const messageId = searchParams.get('messageId')
  const emoji = searchParams.get('emoji')

  if (!messageId || !emoji) {
    return NextResponse.json({ error: 'Missing messageId or emoji' }, { status: 400 })
  }

  const result = await removeReactionDb(messageId, session.userId, emoji)
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
