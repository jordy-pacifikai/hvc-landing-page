import { NextResponse } from 'next/server'
import { getSession } from '@/app/lib/session'

// DEV ONLY — bypass Discord OAuth for local testing
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const session = await getSession()
  session.userId = '828d7a93-4c9d-4355-9b71-c1884a949ca7'
  session.discordId = '451540578249736222'
  session.discordUsername = 'jordybanks'
  session.discordAvatar = null
  session.isPremium = true
  session.role = 'admin'
  await session.save()

  return NextResponse.redirect(new URL('/community', 'http://localhost:3000'))
}
