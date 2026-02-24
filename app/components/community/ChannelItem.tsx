'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Hash, BookOpen } from 'lucide-react'

interface Channel {
  id: string
  name: string
  slug: string
  icon: string | null
  is_readonly: boolean
  channel_type: string
  unread_count?: number
  has_unread?: boolean
}

export default function ChannelItem({ channel }: { channel: Channel }) {
  const pathname = usePathname()
  const isActive = pathname === `/community/${channel.slug}`
  const hasUnreadCount = (channel.unread_count || 0) > 0
  const hasUnread = hasUnreadCount || channel.has_unread

  return (
    <Link
      href={`/community/${channel.slug}`}
      className={`
        flex items-center gap-2 px-2 py-1.5 rounded-md text-sm
        transition-all duration-200
        ${isActive
          ? 'bg-[rgba(99,102,241,0.15)] text-ivory font-medium'
          : hasUnread
            ? 'text-ivory hover:bg-[rgba(255,255,255,0.05)]'
            : 'text-mist hover:text-pearl hover:bg-[rgba(255,255,255,0.03)]'
        }
      `}
    >
      {channel.icon ? (
        <span className="text-base w-5 text-center shrink-0">{channel.icon}</span>
      ) : channel.channel_type === 'forum' ? (
        <BookOpen className="w-4 h-4 shrink-0 text-mist" />
      ) : (
        <Hash className="w-4 h-4 shrink-0 text-mist" />
      )}
      <span className="truncate">{channel.name}</span>
      {hasUnreadCount && (
        <span className="ml-auto bg-champagne text-void text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
          {channel.unread_count}
        </span>
      )}
      {!hasUnreadCount && channel.has_unread && !isActive && (
        <span className="ml-auto w-2 h-2 rounded-full bg-champagne animate-pulse shrink-0" />
      )}
    </Link>
  )
}
