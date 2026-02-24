import type { Message } from './community-api'

// ---------------------------------------------------------------------------
// getAvatarUrl
// Builds the Discord CDN avatar URL for a message user.
// Duplicated previously in: MessageList.tsx, ThreadPanel.tsx
// ---------------------------------------------------------------------------
export function getAvatarUrl(user: Message['user']): string | null {
  if (!user?.discord_avatar) return null
  const discordId = user.discord_id || user.id
  return `https://cdn.discordapp.com/avatars/${discordId}/${user.discord_avatar}.png?size=64`
}

// ---------------------------------------------------------------------------
// formatTime
// Returns HH:MM from a date string, using fr-FR locale.
// Used in: ThreadPanel.tsx (ParentMessage, ThreadReplyRow), MessageList.tsx (MessageRow)
// ---------------------------------------------------------------------------
export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ---------------------------------------------------------------------------
// formatDate
// Returns a human-readable date label: "Aujourd'hui", "Hier", or fr-FR date.
// Used in: ThreadPanel.tsx (ParentMessage)
// ---------------------------------------------------------------------------
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const isSameDay =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()

  if (isSameDay) return "Aujourd'hui"

  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()

  if (isYesterday) return 'Hier'
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

// ---------------------------------------------------------------------------
// formatDateSeparator
// Like formatDate but includes the year for older dates.
// Used in: MessageList.tsx (DateSeparator)
// ---------------------------------------------------------------------------
export function formatDateSeparator(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  if (isSameDay(date, today)) return "Aujourd'hui"
  if (isSameDay(date, yesterday)) return 'Hier'
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
