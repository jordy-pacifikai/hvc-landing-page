const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!
const GUILD_ID = '1472369949141106806'
const DISCORD_API = 'https://discord.com/api/v10'

// Role IDs
export const DISCORD_ROLES = {
  PREMIUM: '1475058567479427157',
  TRADER: '1472515214636482734',
  ELITE: '1472515219896144038',
  HVC_GRADUATE: '1475360695850762250',
} as const

export async function checkMemberRoles(discordId: string): Promise<string[]> {
  const res = await fetch(`${DISCORD_API}/guilds/${GUILD_ID}/members/${discordId}`, {
    headers: { Authorization: `Bot ${BOT_TOKEN}` },
  })

  if (!res.ok) return []

  const member = await res.json()
  return member.roles || []
}

export async function hasPremiumRole(discordId: string): Promise<boolean> {
  const roles = await checkMemberRoles(discordId)
  return roles.includes(DISCORD_ROLES.PREMIUM)
}

export async function assignRole(discordId: string, roleId: string): Promise<boolean> {
  const res = await fetch(
    `${DISCORD_API}/guilds/${GUILD_ID}/members/${discordId}/roles/${roleId}`,
    {
      method: 'PUT',
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    }
  )
  return res.ok
}
