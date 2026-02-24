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
  /** Timestamp (ms) of last Discord role revalidation */
  lastRoleCheck?: number
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

const ROLE_RECHECK_MS = 15 * 60 * 1000 // 15 minutes

/**
 * Returns session + ensures isPremium is set and periodically revalidated.
 * Revalidates role+isPremium via Discord every 15 minutes so revocations
 * take effect within that window instead of waiting 7 days for cookie expiry.
 */
export async function getSessionWithPremium(): Promise<IronSession<SessionData>> {
  const session = await getSession()

  // Session has no userId — not authenticated
  if (!session.userId) return session

  const now = Date.now()
  const needsRecheck =
    typeof session.isPremium !== 'boolean' ||
    !session.lastRoleCheck ||
    now - session.lastRoleCheck > ROLE_RECHECK_MS

  if (needsRecheck && session.discordId) {
    // Skip Discord API call for dev/test users
    if (session.userId?.startsWith('dev-')) {
      session.lastRoleCheck = now
      await session.save()
    } else {
      const isPremium = await hasPremiumRole(session.discordId)
      session.isPremium = isPremium
      session.lastRoleCheck = now
      await session.save()
    }
  }

  return session
}
