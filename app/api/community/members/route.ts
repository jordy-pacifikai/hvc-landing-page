import { NextResponse } from 'next/server'
import { getSessionWithPremium as getSession } from '@/app/lib/session'
import { getOnlineMembers } from '@/app/lib/community-server'

export async function GET() {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await getOnlineMembers()
  if (error) {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }

  return NextResponse.json({ members: data || [] })
}
