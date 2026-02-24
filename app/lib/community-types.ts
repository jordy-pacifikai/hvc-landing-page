import type { Message } from './community-api'

// ---------------------------------------------------------------------------
// SessionData
// Canonical shape returned by useSession() across all community components.
// Duplicated previously in: MessageInput.tsx, ThreadPanel.tsx
// ---------------------------------------------------------------------------
export type SessionData = {
  authenticated: boolean
  userId?: string
  discordId?: string
  discordUsername?: string
  discordAvatar?: string | null
  isPremium?: boolean
  role?: string
}

// ---------------------------------------------------------------------------
// InfiniteMessages
// Shape of the TanStack Query infinite cache for community messages.
// Duplicated previously in: MessageInput.tsx, ThreadPanel.tsx, community-hooks.ts
// ---------------------------------------------------------------------------
export type InfiniteMessages = {
  pages: { messages: Message[]; hasMore: boolean }[]
  pageParams: unknown[]
}

// ---------------------------------------------------------------------------
// Channel
// Canonical channel interface. community-store.ts keeps its own local copy
// as the store definition — this export is for external consumers.
// ---------------------------------------------------------------------------
export interface Channel {
  id: string
  name: string
  slug: string
  description: string | null
  category: string
  icon: string | null
  position: number
  is_readonly: boolean
  min_role: string
  channel_type: string
  unread_count?: number
}
