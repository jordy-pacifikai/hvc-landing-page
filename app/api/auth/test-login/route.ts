import { NextResponse } from 'next/server'
import { getSession } from '@/app/lib/session'
import { upsertUser } from '@/app/lib/supabase-server'
import { hasPremiumRole } from '@/app/lib/discord-api'

// TEMPORARY: Test endpoint - remove before prod
export async function GET() {
  const discordId = '451540578249736222'
  const username = 'jordybanks'
  const isPremium = await hasPremiumRole(discordId)
  const avatar = null

  const { data } = await upsertUser(discordId, username, avatar, isPremium)
  const user = Array.isArray(data) ? data[0] : data

  const session = await getSession()
  session.userId = user?.id || discordId
  session.discordId = discordId
  session.discordUsername = username
  session.discordAvatar = avatar
  session.isPremium = isPremium
  await session.save()

  return NextResponse.redirect(new URL('/formation', 'https://www.highvaluecapital.club'))
}
