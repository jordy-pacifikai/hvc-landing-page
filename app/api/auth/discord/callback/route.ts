import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/app/lib/session'
import { upsertUser } from '@/app/lib/supabase-server'
import { hasPremiumRole } from '@/app/lib/discord-api'

const DISCORD_CLIENT_ID = '988148432843735073'
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!

function getRedirectUri(req: NextRequest) {
  const host = req.headers.get('host') || 'www.highvaluecapital.club'
  const proto = host.includes('localhost') ? 'http' : 'https'
  return `${proto}://${host}/api/auth/discord/callback`
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const redirectTo = req.nextUrl.searchParams.get('state') || '/formation'

  if (!code) {
    return NextResponse.redirect(new URL('/formation?error=discord_cancelled', req.url))
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: getRedirectUri(req),
      }),
    })
    const tokenData = await tokenRes.json()

    if (!tokenData.access_token) {
      console.error('[Auth] Token exchange failed:', tokenData)
      return NextResponse.redirect(new URL('/formation?error=discord_failed', req.url))
    }

    // Get Discord user info
    const userRes = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const user = await userRes.json()

    if (!user.id) {
      return NextResponse.redirect(new URL('/formation?error=discord_no_user', req.url))
    }

    // Check premium role via bot API
    const isPremium = await hasPremiumRole(user.id)

    // Upsert user in Supabase
    const avatar = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      : null

    const { data: userData } = await upsertUser(user.id, user.username, avatar, isPremium)
    const supabaseUser = Array.isArray(userData) ? userData[0] : userData

    // Create iron-session
    const session = await getSession()
    session.userId = supabaseUser?.id || user.id
    session.discordId = user.id
    session.discordUsername = user.username
    session.discordAvatar = avatar
    session.isPremium = isPremium
    await session.save()

    return NextResponse.redirect(new URL(redirectTo, req.url))
  } catch (error) {
    console.error('[Auth] Error:', error)
    return NextResponse.redirect(new URL('/formation?error=discord_error', req.url))
  }
}
