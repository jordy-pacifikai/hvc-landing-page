'use client'

import { useState } from 'react'
import ChannelItem from './ChannelItem'
import { ChevronDown } from 'lucide-react'

interface Channel {
  id: string
  name: string
  slug: string
  icon: string | null
  is_readonly: boolean
  channel_type: string
  unread_count?: number
}

export default function ChannelCategory({ label, channels }: { label: string; channels: Channel[] }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="px-2">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-1 w-full px-1 py-1.5 text-xs font-semibold text-mist/70 uppercase tracking-wider hover:text-mist transition-colors"
      >
        <ChevronDown className={`w-3 h-3 transition-transform ${collapsed ? '-rotate-90' : ''}`} />
        {label}
      </button>
      {!collapsed && (
        <div className="space-y-0.5">
          {channels.map((channel) => (
            <ChannelItem key={channel.id} channel={channel} />
          ))}
        </div>
      )}
    </div>
  )
}
