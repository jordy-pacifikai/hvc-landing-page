import { NextRequest, NextResponse } from 'next/server'
import { getSessionWithPremium as getSession } from '@/app/lib/session'
import { getMessageById } from '@/app/lib/community-server'
import { rateLimit } from '@/app/lib/rate-limit'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limit: 5 reports per minute
  const rl = rateLimit(`report:${session.userId}`, 5, 60_000)
  if (!rl.ok) {
    return NextResponse.json({ error: 'Trop de signalements.' }, { status: 429 })
  }

  const { messageId, reason } = await req.json()
  if (!messageId) {
    return NextResponse.json({ error: 'Missing messageId' }, { status: 400 })
  }

  // Verify message exists
  const { data: message } = await getMessageById(messageId)
  if (!message) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 })
  }

  // Log the report server-side (visible in Vercel logs / console)
  console.warn(
    `[community:report] user=${session.userId} reported message=${messageId} author=${message.user_id} reason="${reason || 'none'}"`,
  )

  return NextResponse.json({ ok: true })
}
