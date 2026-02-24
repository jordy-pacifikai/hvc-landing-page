import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/app/lib/session'
import { upsertUser, getUserByDiscordId } from '@/app/lib/supabase-server'
import { hasPremiumRole } from '@/app/lib/discord-api'

const DISCORD_CLIENT_ID = '988148432843735073'
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!
const REDIRECT_URI = 'https://www.highvaluecapital.club/api/discord/callback'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')

  const getRedirectPath = (s: string | null) => {
    if (s === 'formation') return '/formation'
    if (s === 'community') return '/community'
    return '/'
  }

  if (!code) {
    return NextResponse.redirect(new URL(`${getRedirectPath(state)}?error=discord_cancelled`, req.url))
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
      return NextResponse.redirect(new URL(`${getRedirectPath(state)}?error=discord_failed`, req.url))
    }

    // Get Discord user info
    const userRes = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const user = await userRes.json()

    if (!user.id) {
      return NextResponse.redirect(new URL(`${getRedirectPath(state)}?error=discord_no_user`, req.url))
    }

    // Session flow: create session and redirect (formation or community)
    if (state === 'formation' || state === 'community') {
      const isPremium = await hasPremiumRole(user.id)
      const avatar = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : null

      const { data: userData } = await upsertUser(user.id, user.username, avatar, isPremium)
      let supabaseUser = Array.isArray(userData) ? userData[0] : userData

      // Fallback: if upsert returned nothing, fetch by discord_id
      if (!supabaseUser?.id) {
        const { data: existingUser } = await getUserByDiscordId(user.id)
        supabaseUser = existingUser as { id: string } | null
      }

      if (!supabaseUser?.id) {
        console.error('[Discord OAuth] Could not resolve Supabase user ID for discord_id:', user.id)
        return NextResponse.redirect(new URL(`${getRedirectPath(state)}?error=user_not_found`, req.url))
      }

      const session = await getSession()
      session.userId = supabaseUser.id
      session.discordId = user.id
      session.discordUsername = user.username
      session.discordAvatar = avatar
      session.isPremium = isPremium
      await session.save()

      return NextResponse.redirect(new URL(getRedirectPath(state), req.url))
    }

    // Default: checkout flow (existing behavior)
    const checkoutUrl = new URL('/checkout', req.url)
    checkoutUrl.searchParams.set('discord_id', user.id)
    checkoutUrl.searchParams.set('discord_username', user.username)
    checkoutUrl.searchParams.set('discord_token', tokenData.access_token)

    return NextResponse.redirect(checkoutUrl)
  } catch (error) {
    console.error('[Discord OAuth] Error:', error)
    return NextResponse.redirect(new URL(`${getRedirectPath(state)}?error=discord_error`, req.url))
  }
}
