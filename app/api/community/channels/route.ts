import { NextResponse } from 'next/server'
import { getSessionWithPremium as getSession } from '@/app/lib/session'
import { getChannels, getUnreadCounts, canAccessChannel } from '@/app/lib/community-server'

export async function GET() {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: channels, error } = await getChannels()
  if (error || !channels) {
    return NextResponse.json({ error: 'Failed to fetch channels' }, { status: 500 })
  }

  const accessible = channels.filter((ch) => canAccessChannel(session.role, ch.min_role))
  const channelIds = accessible.map((ch) => ch.id)

  const unreadCounts = await getUnreadCounts(session.userId, channelIds)

  const enriched = accessible.map((ch) => {
    const count = unreadCounts[ch.id] ?? 0
    return {
      ...ch,
      has_unread: count > 0,
      unread_count: count,
    }
  })

  return NextResponse.json(enriched)
}
