import { NextRequest, NextResponse } from 'next/server'
import { getSessionWithPremium as getSession } from '@/app/lib/session'
import { getChannelBySlug, upsertChannelRead } from '@/app/lib/community-server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params

  const channelResult = await getChannelBySlug(slug)
  if (channelResult.error || !channelResult.data) {
    return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
  }

  const channel = channelResult.data as { id: string }
  const result = await upsertChannelRead(session.userId, channel.id)
  if (result.error) {
    // Non-critical: log but don't crash (e.g. userId not yet a valid UUID)
    console.warn('[community/read] upsertChannelRead failed (non-fatal):', result.error)
  }

  return NextResponse.json({ ok: true })
}
