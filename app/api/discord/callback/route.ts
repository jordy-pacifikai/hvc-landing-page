import { NextRequest, NextResponse } from 'next/server'

const DISCORD_CLIENT_ID = '988148432843735073'
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!
const REDIRECT_URI = 'https://www.highvaluecapital.club/api/discord/callback'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/?error=discord_cancelled', req.url))
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
      return NextResponse.redirect(new URL('/?error=discord_failed', req.url))
    }

    // Get Discord user info
    const userRes = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const user = await userRes.json()

    if (!user.id) {
      return NextResponse.redirect(new URL('/?error=discord_no_user', req.url))
    }

    // Redirect to checkout with Discord info
    const checkoutUrl = new URL('/checkout', req.url)
    checkoutUrl.searchParams.set('discord_id', user.id)
    checkoutUrl.searchParams.set('discord_username', user.username)
    checkoutUrl.searchParams.set('discord_token', tokenData.access_token)

    return NextResponse.redirect(checkoutUrl)
  } catch (error) {
    console.error('[Discord OAuth] Error:', error)
    return NextResponse.redirect(new URL('/?error=discord_error', req.url))
  }
}
