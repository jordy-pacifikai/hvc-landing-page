import { NextRequest, NextResponse } from 'next/server'
import { getSessionWithPremium as getSession } from '@/app/lib/session'
import { addReactionDb, removeReactionDb } from '@/app/lib/community-server'
import { rateLimit } from '@/app/lib/rate-limit'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limit: 60 reactions per minute
  const rl = rateLimit(`react:${session.userId}`, 60, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ error: 'Trop de reactions. Reessaie dans quelques secondes.' }, { status: 429 })
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
