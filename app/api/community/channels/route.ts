import { NextResponse } from 'next/server'
import { getSession } from '@/app/lib/session'
import { getChannels, getChannelReads } from '@/app/lib/community-server'

export async function GET() {
  const session = await getSession()
  if (!session.userId) {
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

  const enriched = channels.map((ch) => ({
    ...ch,
    unread_count: 0,
  }))

  return NextResponse.json(enriched)
}
