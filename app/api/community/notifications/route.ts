import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/app/lib/session'
import { getUserNotifications, markNotificationsReadDb } from '@/app/lib/community-server'

export async function GET() {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await getUserNotifications(session.userId)
  return NextResponse.json(result.data || [])
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { ids } = await request.json()
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'Missing or invalid ids' }, { status: 400 })
  }

  const result = await markNotificationsReadDb(ids, session.userId)
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
