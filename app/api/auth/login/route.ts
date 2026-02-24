import { NextResponse } from 'next/server'

const DISCORD_CLIENT_ID = '988148432843735073'
// Use the existing registered redirect URI
const REDIRECT_URI = 'https://www.highvaluecapital.club/api/discord/callback'

export async function GET() {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'identify guilds.members.read',
    state: 'formation', // tells the callback to create a session and redirect to /formation
  })

  return NextResponse.redirect(`https://discord.com/api/oauth2/authorize?${params}`)
}
