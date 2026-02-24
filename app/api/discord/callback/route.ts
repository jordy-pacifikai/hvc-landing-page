import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/app/lib/session'
import { upsertUser } from '@/app/lib/supabase-server'
import { hasPremiumRole } from '@/app/lib/discord-api'

const DISCORD_CLIENT_ID = '988148432843735073'
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!
const REDIRECT_URI = 'https://www.highvaluecapital.club/api/discord/callback'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')

  if (!code) {
    const errorRedirect = state === 'formation' ? '/formation?error=discord_cancelled' : '/?error=discord_cancelled'
    return NextResponse.redirect(new URL(errorRedirect, req.url))
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
        redirect_uri: REDIRECT_URI,
      }),
    })
    const tokenData = await tokenRes.json()

    if (!tokenData.access_token) {
      console.error('[Discord OAuth] Token exchange failed:', tokenData)
      const errorRedirect = state === 'formation' ? '/formation?error=discord_failed' : '/?error=discord_failed'
      return NextResponse.redirect(new URL(errorRedirect, req.url))
    }

    // Get Discord user info
    const userRes = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const user = await userRes.json()

    if (!user.id) {
      const errorRedirect = state === 'formation' ? '/formation?error=discord_no_user' : '/?error=discord_no_user'
      return NextResponse.redirect(new URL(errorRedirect, req.url))
    }

    // Formation flow: create session and redirect to /formation
    if (state === 'formation') {
      const isPremium = await hasPremiumRole(user.id)
      const avatar = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : null

      const { data: userData } = await upsertUser(user.id, user.username, avatar, isPremium)
      const supabaseUser = Array.isArray(userData) ? userData[0] : userData

      const session = await getSession()
      session.userId = supabaseUser?.id || user.id
      session.discordId = user.id
      session.discordUsername = user.username
      session.discordAvatar = avatar
      session.isPremium = isPremium
      await session.save()

      return NextResponse.redirect(new URL('/formation', req.url))
    }

    // Default: checkout flow (existing behavior)
    const checkoutUrl = new URL('/checkout', req.url)
    checkoutUrl.searchParams.set('discord_id', user.id)
    checkoutUrl.searchParams.set('discord_username', user.username)
    checkoutUrl.searchParams.set('discord_token', tokenData.access_token)

    return NextResponse.redirect(checkoutUrl)
  } catch (error) {
    console.error('[Discord OAuth] Error:', error)
    const errorRedirect = state === 'formation' ? '/formation?error=discord_error' : '/?error=discord_error'
    return NextResponse.redirect(new URL(errorRedirect, req.url))
  }
}
