import { create } from 'zustand'

interface Channel {
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

export interface TypingUser {
  userId: string
  username: string
  timestamp: number
}

interface CommunityState {
  // Sidebar
  sidebarOpen: boolean
  membersSidebarOpen: boolean
  toggleSidebar: () => void
  toggleMembersSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setMembersSidebarOpen: (open: boolean) => void

  // Active channel
  activeChannelSlug: string | null
  setActiveChannel: (slug: string) => void

  // Channels data
  channels: Channel[]
  setChannels: (channels: Channel[]) => void

  // Typing indicators
  typingUsers: Record<string, TypingUser[]> // channelId -> typing users
  setTypingUsers: (channelId: string, users: TypingUser[]) => void
  addTypingUser: (channelId: string, user: TypingUser) => void
  removeTypingUser: (channelId: string, userId: string) => void

  // Online presence (array instead of Set to avoid Zustand/useSyncExternalStore infinite loop)
  onlineUsers: string[]
  setOnlineUsers: (users: string[]) => void

  // Thread
  activeThread: string | null // message id
  setActiveThread: (messageId: string | null) => void

  // Search
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
}

export const useCommunityStore = create<CommunityState>((set) => ({
  sidebarOpen: true,
  membersSidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleMembersSidebar: () => set((s) => ({ membersSidebarOpen: !s.membersSidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setMembersSidebarOpen: (open) => set({ membersSidebarOpen: open }),

  activeChannelSlug: null,
  setActiveChannel: (slug) => set({ activeChannelSlug: slug }),

  channels: [],
  setChannels: (channels) => set({ channels }),

  typingUsers: {},
  setTypingUsers: (channelId, users) =>
    set((s) => ({ typingUsers: { ...s.typingUsers, [channelId]: users } })),
  addTypingUser: (channelId, user) =>
    set((s) => {
      const current = s.typingUsers[channelId] || []
      const filtered = current.filter((u) => u.userId !== user.userId)
      return { typingUsers: { ...s.typingUsers, [channelId]: [...filtered, user] } }
    }),
  removeTypingUser: (channelId, userId) =>
    set((s) => {
      const current = s.typingUsers[channelId] || []
      return { typingUsers: { ...s.typingUsers, [channelId]: current.filter((u) => u.userId !== userId) } }
    }),

  onlineUsers: [],
  setOnlineUsers: (users) => set({ onlineUsers: users }),

  activeThread: null,
  setActiveThread: (messageId) => set({ activeThread: messageId }),

  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
}))
