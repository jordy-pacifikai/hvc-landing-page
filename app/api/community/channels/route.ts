import { NextResponse } from 'next/server'
import { getSessionWithPremium as getSession } from '@/app/lib/session'
import { getChannels, getChannelReads, getLatestMessageTimes } from '@/app/lib/community-server'

export async function GET() {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: channels, error } = await getChannels()
  if (error || !channels) {
    return NextResponse.json({ error: 'Failed to fetch channels' }, { status: 500 })
  }

  const { data: reads } = await getChannelReads(session.userId)
  const readMap = new Map(
    (reads || []).map((r) => [r.channel_id, r.last_read_at])
  )

  // Attempt to get latest message times per channel (RPC may not exist — graceful fallback)
  const { data: latestTimes } = await getLatestMessageTimes()
  const latestMap = new Map(
    (latestTimes || []).map((l) => [l.channel_id, l.latest])
  )

  const enriched = channels.map((ch) => {
    const lastReadAt = readMap.get(ch.id) ?? null
    const latestMessageAt = latestMap.get(ch.id) ?? null

    let has_unread = false

    if (latestMessageAt) {
      // Channel has messages: unread if never read, or read timestamp is older than latest message
      if (!lastReadAt) {
        has_unread = true
      } else {
        has_unread = new Date(latestMessageAt) > new Date(lastReadAt)
      }
    }
    // If no latestMessageAt (RPC not available or no messages), has_unread stays false

    return {
      ...ch,
      has_unread,
      unread_count: 0,
    }
  })

  return NextResponse.json(enriched)
}
