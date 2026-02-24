'use client'

import { useCallback, useMemo } from 'react'
import { Bell } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useNotifications, useMarkNotificationsRead } from '@/app/lib/community-hooks'
import { useCommunityStore } from '@/app/lib/community-store'
import type { Notification } from '@/app/lib/community-api'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return "à l'instant"
  if (minutes < 60) return `il y a ${minutes}min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `il y a ${days}j`
  return `il y a ${Math.floor(days / 7)}sem`
}

function notificationText(n: Notification, channelMap: Map<string, { slug: string; name: string }>): string {
  const sender = n.sender ? `@${n.sender.discord_username}` : 'Quelqu\'un'
  const channelName = n.channel_id ? (channelMap.get(n.channel_id)?.name || 'channel') : ''
  switch (n.type) {
    case 'mention':
      return `${sender} t'a mentionné${channelName ? ` dans #${channelName}` : ''}`
    case 'reply':
      return `${sender} a répondu à ton message`
    case 'reaction':
      return `${sender} a réagi à ton message`
    case 'forum_reply':
      return `${sender} a commenté ton post`
    case 'announcement':
      return `Nouvelle annonce${channelName ? ` dans #${channelName}` : ''}`
    default:
      return `${sender} t'a envoyé une notification`
  }
}

function notificationHref(n: Notification, channelMap: Map<string, { slug: string; name: string }>): string {
  if (n.post_id) return `/community/forum/${n.post_id}`
  if (n.channel_id) {
    const ch = channelMap.get(n.channel_id)
    return `/community/${ch?.slug || n.channel_id}`
  }
  return '/community'
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

function NotifAvatar({ sender }: { sender: Notification['sender'] }) {
  if (!sender) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-champagne)] to-[rgba(212,175,55,0.4)] flex items-center justify-center shrink-0">
        <span className="text-[var(--color-void)] text-xs font-bold">?</span>
      </div>
    )
  }

  const initial = sender.discord_username.charAt(0).toUpperCase()

  if (sender.discord_avatar) {
    return (
      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-[var(--color-slate)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://cdn.discordapp.com/avatars/${sender.discord_id}/${sender.discord_avatar}.png?size=64`}
          alt={sender.discord_username}
          width={32}
          height={32}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent) {
              parent.innerHTML = `<span class="w-full h-full flex items-center justify-center text-[var(--color-void)] text-xs font-bold">${initial}</span>`
              parent.style.background = 'linear-gradient(135deg, var(--color-champagne), rgba(212,175,55,0.4))'
            }
          }}
        />
      </div>
    )
  }

  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-champagne)] to-[rgba(212,175,55,0.4)] flex items-center justify-center shrink-0">
      <span className="text-[var(--color-void)] text-xs font-bold">{initial}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function NotificationSkeleton() {
  return (
    <div className="px-3 py-3 flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-[var(--color-slate)] shrink-0 animate-pulse" />
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="h-3 bg-[var(--color-slate)] rounded animate-pulse w-3/4" />
        <div className="h-2.5 bg-[var(--color-slate)] rounded animate-pulse w-1/3" />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Notification item
// ---------------------------------------------------------------------------

interface NotifItemProps {
  notification: Notification
  channelMap: Map<string, { slug: string; name: string }>
  onRead: (id: string) => void
  onClose: () => void
}

function NotificationItem({ notification, channelMap, onRead, onClose }: NotifItemProps) {
  const router = useRouter()
  const isUnread = !notification.is_read

  function handleClick() {
    if (isUnread) onRead(notification.id)
    router.push(notificationHref(notification, channelMap))
    onClose()
  }

  return (
    <button
      onClick={handleClick}
      className={[
        'w-full text-left px-3 py-3 flex items-start gap-3 transition-all duration-200',
        'hover:bg-[rgba(255,255,255,0.04)] focus:outline-none focus:bg-[rgba(255,255,255,0.04)]',
        isUnread
          ? 'border-l-2 border-[var(--color-champagne)] bg-[rgba(212,175,55,0.04)] pl-[10px]'
          : 'border-l-2 border-transparent',
      ].join(' ')}
    >
      <NotifAvatar sender={notification.sender} />

      <div className="flex-1 min-w-0">
        <p className={`text-xs leading-relaxed ${isUnread ? 'text-ivory' : 'text-pearl'}`}>
          {notificationText(notification, channelMap)}
        </p>
        <p className="text-[11px] text-mist mt-0.5">{relativeTime(notification.created_at)}</p>
      </div>

      {isUnread && (
        <span className="w-2 h-2 rounded-full bg-[var(--color-champagne)] shrink-0 mt-1.5" />
      )}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Main dropdown
// ---------------------------------------------------------------------------

interface NotificationDropdownProps {
  onClose: () => void
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { data: notifications = [], isLoading } = useNotifications()
  const markRead = useMarkNotificationsRead()
  const channels = useCommunityStore((s) => s.channels)
  const channelMap = useMemo(() => {
    const map = new Map<string, { slug: string; name: string }>()
    channels.forEach((ch) => map.set(ch.id, { slug: ch.slug, name: ch.name }))
    return map
  }, [channels])

  const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)

  const handleMarkAllRead = useCallback(() => {
    if (unreadIds.length === 0) return
    markRead.mutate(unreadIds)
  }, [unreadIds, markRead])

  const handleReadOne = useCallback(
    (id: string) => {
      markRead.mutate([id])
    },
    [markRead]
  )

  return (
    <div
      className={[
        'absolute right-0 top-full mt-2 z-50',
        'w-[380px] max-w-[calc(100vw-2rem)] max-h-[480px]',
        'bg-[var(--color-charcoal)] border border-[rgba(99,102,241,0.12)] rounded-xl shadow-2xl',
        'flex flex-col overflow-hidden',
      ].join(' ')}
      style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(99,102,241,0.08)] shrink-0">
        <h3 className="text-sm font-semibold text-ivory">Notifications</h3>
        {unreadIds.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markRead.isPending}
            className="text-[11px] text-[var(--color-champagne)] hover:text-ivory transition-colors disabled:opacity-50"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1 divide-y divide-[rgba(99,102,241,0.05)]">
        {isLoading ? (
          <>
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </>
        ) : notifications.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center gap-3 py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-slate)] flex items-center justify-center">
              <Bell className="w-5 h-5 text-mist" />
            </div>
            <p className="text-sm text-mist text-center">Aucune notification</p>
          </div>
        ) : (
          notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              channelMap={channelMap}
              onRead={handleReadOne}
              onClose={onClose}
            />
          ))
        )}
      </div>
    </div>
  )
}
