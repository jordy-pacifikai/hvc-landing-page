'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from '@/app/lib/community-hooks'
import NotificationDropdown from './NotificationDropdown'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { data: notifications = [] } = useNotifications()

  const unreadCount = notifications.filter((n) => !n.is_read).length

  // Close on outside click
  useEffect(() => {
    if (!open) return

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="text-mist hover:text-ivory transition-colors p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.05)] relative"
        title="Notifications"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ''}`}
      >
        <Bell className="w-4 h-4" />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <>
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 rounded-full bg-[var(--color-champagne)] text-[var(--color-void)] text-[10px] font-bold leading-4 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
            {/* Pulsing dot */}
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-[var(--color-champagne)] animate-ping opacity-40 pointer-events-none" />
          </>
        )}
      </button>

      {open && (
        <NotificationDropdown onClose={() => setOpen(false)} />
      )}
    </div>
  )
}
