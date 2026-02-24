import { NextResponse } from 'next/server'
import { getSession } from '@/app/lib/session'

export async function GET() {
  const session = await getSession()

  if (!session.userId) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({
    authenticated: true,
    userId: session.userId,
    discordId: session.discordId,
    discordUsername: session.discordUsername,
    discordAvatar: session.discordAvatar,
    isPremium: session.isPremium,
    role: session.role ?? 'member',
  })
}

export async function DELETE() {
  const session = await getSession()
  session.destroy()
  return NextResponse.json({ ok: true })
}
