import { NextRequest, NextResponse } from 'next/server'

const DISCORD_CLIENT_ID = '988148432843735073'
// Use the existing registered redirect URI
const REDIRECT_URI = 'https://www.highvaluecapital.club/api/discord/callback'

export async function GET(req: NextRequest) {
  const requestState = req.nextUrl.searchParams.get('state') || 'formation'
  const validStates = ['formation', 'community', 'checkout']
  const state = validStates.includes(requestState) ? requestState : 'formation'

  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'identify guilds.members.read',
    state,
  })

  return NextResponse.redirect(`https://discord.com/api/oauth2/authorize?${params}`)
}
