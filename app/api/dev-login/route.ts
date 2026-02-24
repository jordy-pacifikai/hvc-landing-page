import { NextResponse } from 'next/server'
import { getSession } from '@/app/lib/session'

// DEV ONLY — bypass Discord OAuth for local testing
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const session = await getSession()
  session.userId = 'dev-user-123'
  session.discordId = '123456789012345678'
  session.discordUsername = 'JordyTest'
  session.discordAvatar = null
  session.isPremium = true
  await session.save()

  return NextResponse.redirect(new URL('/community', 'http://localhost:3847'))
}
