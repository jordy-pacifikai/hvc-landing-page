import { getIronSession, IronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { hasPremiumRole } from './discord-api'

export interface SessionData {
  userId: string
  discordId: string
  discordUsername: string
  discordAvatar: string | null
  isPremium: boolean
  role?: string
}

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'hvc_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
}

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}

/**
 * Returns session + ensures isPremium is set.
 * For old sessions missing isPremium, falls back to a live Discord check
 * and refreshes the session cookie in place.
 */
export async function getSessionWithPremium(): Promise<IronSession<SessionData>> {
  const session = await getSession()

  // Session has no userId — not authenticated
  if (!session.userId) return session

  // isPremium already set (new sessions) — return as-is
  if (typeof session.isPremium === 'boolean') return session

  // Old session: isPremium missing — check Discord live and patch the cookie
  if (session.discordId) {
    const isPremium = await hasPremiumRole(session.discordId)
    session.isPremium = isPremium
    await session.save()
  }

  return session
}
