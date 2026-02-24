'use client'

import { useCommunityStore } from '@/app/lib/community-store'
import { Menu, Users, Search, Bell } from 'lucide-react'

export default function CommunityHeader() {
  const { channels, activeChannelSlug, toggleSidebar, toggleMembersSidebar, setSearchOpen } = useCommunityStore()
  const channel = channels.find((c) => c.slug === activeChannelSlug)

  return (
    <header className="h-12 bg-[var(--color-obsidian)] border-b border-[rgba(99,102,241,0.08)] flex items-center px-4 gap-3 shrink-0">
      <button
        onClick={toggleSidebar}
        className="lg:hidden text-mist hover:text-ivory transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {channel && (
        <div className="flex items-center gap-2 min-w-0">
          {channel.icon && <span className="text-lg">{channel.icon}</span>}
          <h2 className="text-ivory font-medium truncate">{channel.name}</h2>
          {channel.description && (
            <>
              <div className="w-px h-5 bg-[rgba(99,102,241,0.15)]" />
              <span className="text-mist text-sm truncate hidden sm:block">{channel.description}</span>
            </>
          )}
        </div>
      )}

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="text-mist hover:text-ivory transition-colors p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.05)]"
          title="Rechercher (Cmd+K)"
        >
          <Search className="w-4 h-4" />
        </button>
        <button
          className="text-mist hover:text-ivory transition-colors p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.05)] relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>
        <button
          onClick={toggleMembersSidebar}
          className="hidden xl:block text-mist hover:text-ivory transition-colors p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.05)]"
          title="Membres"
        >
          <Users className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
