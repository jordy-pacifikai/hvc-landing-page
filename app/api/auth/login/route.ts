import { NextResponse } from 'next/server'

const DISCORD_CLIENT_ID = '988148432843735073'
const REDIRECT_URI = process.env.NODE_ENV === 'production'
  ? 'https://www.highvaluecapital.club/api/auth/discord/callback'
  : 'http://localhost:3000/api/auth/discord/callback'

export async function GET() {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'identify guilds.members.read',
  })

  return NextResponse.redirect(`https://discord.com/api/oauth2/authorize?${params}`)
}
