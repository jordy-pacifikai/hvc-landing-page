// Server-side Supabase helpers for community

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!

interface SupabaseResponse<T = unknown> {
  data: T | null
  error: string | null
}

async function supabaseFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<SupabaseResponse<T>> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...options.headers,
    },
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`[Supabase Community] ${res.status}: ${err}`)
    return { data: null, error: err }
  }

  const data = await res.json()
  return { data, error: null }
}

// --- Role Hierarchy ---

const ROLE_HIERARCHY: Record<string, number> = { member: 0, moderator: 1, admin: 2 }

export function canAccessChannel(userRole: string | undefined, channelMinRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole || 'member'] ?? 0
  const requiredLevel = ROLE_HIERARCHY[channelMinRole] ?? 0
  return userLevel >= requiredLevel
}

// --- Channels ---

export async function getChannels() {
  return supabaseFetch<Array<{
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
  }>>('hvc_channels?select=*&order=category.asc,position.asc')
}

export async function getChannelBySlug(slug: string) {
  return supabaseFetch('hvc_channels?slug=eq.' + slug + '&select=*', {
    method: 'GET',
    headers: { Accept: 'application/vnd.pgrst.object+json' },
  })
}

export async function getChannelById(id: string) {
  return supabaseFetch<{ id: string; is_readonly: boolean; min_role: string }>('hvc_channels?id=eq.' + id + '&select=id,is_readonly,min_role', {
    method: 'GET',
    headers: { Accept: 'application/vnd.pgrst.object+json' },
  })
}

export async function getMessageById(id: string) {
  return supabaseFetch<{ id: string; user_id: string; channel_id: string }>('hvc_messages?id=eq.' + id + '&select=id,user_id,channel_id', {
    method: 'GET',
    headers: { Accept: 'application/vnd.pgrst.object+json' },
  })
}

// --- Messages ---

export async function getMessages(channelId: string, limit = 30, cursor?: string) {
  let path = `hvc_messages?channel_id=eq.${channelId}&select=*,user:hvc_users(id,discord_id,discord_username,discord_avatar,role,is_premium)&order=created_at.desc&limit=${limit}`
  if (cursor) {
    path += `&created_at=lt.${cursor}`
  }
  return supabaseFetch<Array<{
    id: string
    channel_id: string
    user_id: string
    content: string
    image_url: string | null
    is_edited: boolean
    reply_to: string | null
    created_at: string
    user: {
      id: string
      discord_id: string
      discord_username: string
      discord_avatar: string | null
      role: string
      is_premium: boolean
    }
  }>>(path)
}

export async function createMessage(
  channelId: string,
  userId: string,
  content: string,
  replyTo?: string,
  imageUrl?: string
) {
  return supabaseFetch('hvc_messages', {
    method: 'POST',
    body: JSON.stringify({
      channel_id: channelId,
      user_id: userId,
      content,
      reply_to: replyTo || null,
      image_url: imageUrl || null,
    }),
  })
}

export async function deleteMessageById(messageId: string) {
  return supabaseFetch(`hvc_messages?id=eq.${messageId}`, {
    method: 'DELETE',
  })
}

export async function updateMessageContent(messageId: string, content: string) {
  return supabaseFetch(`hvc_messages?id=eq.${messageId}`, {
    method: 'PATCH',
    headers: { Accept: 'application/vnd.pgrst.object+json' },
    body: JSON.stringify({ content, is_edited: true }),
  })
}

// --- Reactions ---

export async function getReactions(messageIds: string[]) {
  if (!messageIds.length) return { data: [], error: null }
  const ids = messageIds.map(id => `"${id}"`).join(',')
  return supabaseFetch<Array<{
    id: string
    message_id: string
    user_id: string
    emoji: string
  }>>(`hvc_reactions?message_id=in.(${ids})&select=*`)
}

export async function addReactionDb(messageId: string, userId: string, emoji: string) {
  return supabaseFetch('hvc_reactions', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({ message_id: messageId, user_id: userId, emoji }),
  })
}

export async function removeReactionDb(messageId: string, userId: string, emoji: string) {
  return supabaseFetch(
    `hvc_reactions?message_id=eq.${messageId}&user_id=eq.${userId}&emoji=eq.${encodeURIComponent(emoji)}`,
    { method: 'DELETE' }
  )
}

// --- Channel Reads ---

export async function getChannelReads(userId: string) {
  return supabaseFetch<Array<{
    channel_id: string
    last_read_at: string
  }>>(`hvc_channel_reads?user_id=eq.${userId}&select=channel_id,last_read_at`)
}

export async function upsertChannelRead(userId: string, channelId: string) {
  return supabaseFetch('hvc_channel_reads', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({
      user_id: userId,
      channel_id: channelId,
      last_read_at: new Date().toISOString(),
    }),
  })
}

// --- Unread Counts ---

export async function getLatestMessageTimes() {
  // Get the latest message time per channel
  return supabaseFetch<Array<{
    channel_id: string
    latest: string
  }>>('rpc/get_latest_message_times', {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

export async function getUnreadCounts(userId: string, channelIds: string[]) {
  // For each channel, count messages newer than last read
  // Uses individual count queries — acceptable for ~20 channels
  const reads = await getChannelReads(userId)
  const readMap = new Map((reads.data || []).map((r) => [r.channel_id, r.last_read_at]))

  const counts: Record<string, number> = {}
  await Promise.all(
    channelIds.map(async (channelId) => {
      const lastRead = readMap.get(channelId)
      let path = `hvc_messages?channel_id=eq.${channelId}&select=id`
      if (lastRead) {
        path += `&created_at=gt.${lastRead}`
      }
      path += '&limit=100'
      const { data } = await supabaseFetch<Array<{ id: string }>>(path)
      counts[channelId] = data?.length ?? 0
    })
  )
  return counts
}

// --- Forum Posts ---

export async function getForumPosts(channelId: string, limit = 20, cursor?: string) {
  let path = `hvc_forum_posts?channel_id=eq.${channelId}&select=*,user:hvc_users(id,discord_id,discord_username,discord_avatar,role)&order=is_pinned.desc,created_at.desc&limit=${limit}`
  if (cursor) {
    path += `&created_at=lt.${cursor}`
  }
  return supabaseFetch(path)
}

export async function createForumPostDb(channelId: string, userId: string, title: string, content: string) {
  return supabaseFetch('hvc_forum_posts', {
    method: 'POST',
    body: JSON.stringify({
      channel_id: channelId,
      user_id: userId,
      title,
      content,
    }),
  })
}

export async function getForumPostById(postId: string) {
  return supabaseFetch(`hvc_forum_posts?id=eq.${postId}&select=*,user:hvc_users(id,discord_id,discord_username,discord_avatar,role)`, {
    method: 'GET',
    headers: { Accept: 'application/vnd.pgrst.object+json' },
  })
}

export async function getForumComments(postId: string) {
  return supabaseFetch(`hvc_forum_comments?post_id=eq.${postId}&select=*,user:hvc_users(id,discord_id,discord_username,discord_avatar,role)&order=created_at.asc`)
}

export async function createForumCommentDb(postId: string, userId: string, content: string) {
  return supabaseFetch('hvc_forum_comments', {
    method: 'POST',
    body: JSON.stringify({
      post_id: postId,
      user_id: userId,
      content,
    }),
  })
}

export async function incrementPostViews(postId: string) {
  // Use raw SQL via RPC or just PATCH with increment
  return supabaseFetch(`hvc_forum_posts?id=eq.${postId}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ views: undefined }), // Will need RPC for increment
  })
}

// --- Notifications ---

export async function getUserNotifications(userId: string, limit = 20) {
  return supabaseFetch(`hvc_notifications?user_id=eq.${userId}&select=*,sender:hvc_users!sender_id(discord_id,discord_username,discord_avatar)&order=created_at.desc&limit=${limit}`)
}

export async function createNotification(
  userId: string,
  senderId: string,
  type: string,
  channelId?: string,
  messageId?: string,
  postId?: string
) {
  return supabaseFetch('hvc_notifications', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      sender_id: senderId,
      type,
      channel_id: channelId || null,
      message_id: messageId || null,
      post_id: postId || null,
    }),
  })
}

export async function markNotificationsReadDb(ids: string[], userId: string) {
  const idList = ids.map(id => `"${id}"`).join(',')
  return supabaseFetch(`hvc_notifications?id=in.(${idList})&user_id=eq.${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ is_read: true }),
  })
}

// --- User ---

export async function getUserById(userId: string) {
  return supabaseFetch('hvc_users?id=eq.' + userId + '&select=*', {
    method: 'GET',
    headers: { Accept: 'application/vnd.pgrst.object+json' },
  })
}

export async function getOnlineMembers() {
  return supabaseFetch<Array<{
    id: string
    discord_username: string
    discord_avatar: string | null
    role: string
    is_premium: boolean
  }>>('hvc_users?select=id,discord_username,discord_avatar,role,is_premium&order=discord_username.asc')
}

// --- Search ---

export async function searchMessages(query: string, limit = 20) {
  // Use ILIKE for now, can upgrade to full-text search later
  return supabaseFetch(`hvc_messages?content=ilike.*${encodeURIComponent(query)}*&select=*,user:hvc_users(id,discord_id,discord_username,discord_avatar)&order=created_at.desc&limit=${limit}`)
}

export async function searchForumPosts(query: string, limit = 20) {
  return supabaseFetch(`hvc_forum_posts?or=(title.ilike.*${encodeURIComponent(query)}*,content.ilike.*${encodeURIComponent(query)}*)&select=*,user:hvc_users(id,discord_id,discord_username,discord_avatar)&order=created_at.desc&limit=${limit}`)
}
