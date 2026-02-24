// Client-side fetch helpers for community pages

// Types

export interface Message {
  id: string
  channel_id: string
  user_id: string
  content: string
  image_url: string | null
  is_edited: boolean
  reply_to: string | null
  created_at: string
  user?: {
    id: string
    discord_username: string
    discord_avatar: string | null
    role: string
    is_premium: boolean
  }
  reactions?: Array<{
    emoji: string
    count: number
    has_reacted: boolean
  }>
  reply_count?: number
}

export interface ForumPost {
  id: string
  channel_id: string
  user_id: string
  title: string
  content: string
  is_pinned: boolean
  views: number
  created_at: string
  updated_at: string
  user?: {
    id: string
    discord_username: string
    discord_avatar: string | null
    role: string
  }
  comment_count?: number
}

export interface ForumComment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  user?: {
    id: string
    discord_username: string
    discord_avatar: string | null
    role: string
  }
}

export interface Notification {
  id: string
  type: string
  channel_id: string | null
  message_id: string | null
  post_id: string | null
  is_read: boolean
  created_at: string
  sender?: {
    discord_username: string
    discord_avatar: string | null
  }
}

// Fetch helpers

export async function fetchChannels() {
  const res = await fetch('/api/community/channels')
  if (!res.ok) return []
  return res.json()
}

export async function fetchMessages(channelSlug: string, cursor?: string) {
  const params = new URLSearchParams({ slug: channelSlug, limit: '30' })
  if (cursor) params.set('cursor', cursor)
  const res = await fetch(`/api/community/messages?${params}`)
  if (!res.ok) return { messages: [], hasMore: false }
  return res.json()
}

export async function sendMessage(channelId: string, content: string, replyTo?: string) {
  const res = await fetch('/api/community/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channelId, content, replyTo }),
  })
  if (!res.ok) throw new Error('Failed to send message')
  return res.json()
}

export async function deleteMessage(messageId: string) {
  const res = await fetch(`/api/community/messages?id=${messageId}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete message')
  return res.json()
}

export async function addReaction(messageId: string, emoji: string) {
  const res = await fetch('/api/community/messages/reactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messageId, emoji }),
  })
  if (!res.ok) throw new Error('Failed to add reaction')
  return res.json()
}

export async function removeReaction(messageId: string, emoji: string) {
  const res = await fetch(`/api/community/messages/reactions?messageId=${messageId}&emoji=${encodeURIComponent(emoji)}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to remove reaction')
  return res.json()
}

export async function markChannelRead(channelSlug: string) {
  const res = await fetch(`/api/community/channels/${channelSlug}/read`, {
    method: 'POST',
  })
  if (!res.ok) throw new Error('Failed to mark as read')
  return res.json()
}

export async function fetchForumPosts(channelSlug: string, cursor?: string) {
  const params = new URLSearchParams({ slug: channelSlug })
  if (cursor) params.set('cursor', cursor)
  const res = await fetch(`/api/community/forum?${params}`)
  if (!res.ok) return { posts: [], hasMore: false }
  return res.json()
}

export async function createForumPost(channelId: string, title: string, content: string) {
  const res = await fetch('/api/community/forum', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channelId, title, content }),
  })
  if (!res.ok) throw new Error('Failed to create post')
  return res.json()
}

export async function fetchForumPost(postId: string) {
  const res = await fetch(`/api/community/forum/${postId}`)
  if (!res.ok) return null
  return res.json()
}

export async function addForumComment(postId: string, content: string) {
  const res = await fetch(`/api/community/forum/${postId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  if (!res.ok) throw new Error('Failed to add comment')
  return res.json()
}

export async function fetchNotifications() {
  const res = await fetch('/api/community/notifications')
  if (!res.ok) return []
  return res.json()
}

export async function markNotificationsRead(ids: string[]) {
  const res = await fetch('/api/community/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  })
  if (!res.ok) throw new Error('Failed to mark as read')
  return res.json()
}

export async function searchCommunity(query: string) {
  const res = await fetch(`/api/community/search?q=${encodeURIComponent(query)}`)
  if (!res.ok) return { messages: [], posts: [] }
  return res.json()
}
