'use client'

import { useEffect, useRef } from 'react'
import { supabase } from './supabase-client'
import { useCommunityStore } from './community-store'
import type { Message } from './community-api'
import { useQueryClient } from '@tanstack/react-query'

export function useCommunityRealtime(channelId: string | null) {
  const queryClient = useQueryClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null)

  useEffect(() => {
    if (!channelId || !supabase) return

    // Subscribe to new messages in this channel
    const channel = supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'hvc_messages',
          filter: `channel_id=eq.${channelId}`,
        },
        () => {
          // Add new message to cache
          queryClient.invalidateQueries({ queryKey: ['community', 'messages'] })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'hvc_messages',
          filter: `channel_id=eq.${channelId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['community', 'messages'] })
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current && supabase) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [channelId, queryClient])
}

export function useTypingBroadcast(channelId: string | null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null)
  const { addTypingUser, removeTypingUser } = useCommunityStore()

  useEffect(() => {
    if (!channelId || !supabase) return

    const channel = supabase
      .channel(`typing:${channelId}`)
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.isTyping) {
          addTypingUser(channelId, {
            userId: payload.userId,
            username: payload.username,
            timestamp: Date.now(),
          })
          // Auto-remove after 3 seconds
          setTimeout(() => {
            removeTypingUser(channelId, payload.userId)
          }, 3000)
        } else {
          removeTypingUser(channelId, payload.userId)
        }
      })
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current && supabase) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [channelId, addTypingUser, removeTypingUser])

  const sendTyping = (userId: string, username: string, isTyping: boolean) => {
    if (!channelRef.current) return
    channelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId, username, isTyping },
    })
  }

  return { sendTyping }
}

export function usePresence() {
  const { setOnlineUsers } = useCommunityStore()

  useEffect(() => {
    if (!supabase) return

    const channel = supabase.channel('online-users')

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const users = new Set<string>()
        Object.values(state).forEach((presences) => {
          presences.forEach((p: Record<string, unknown>) => {
            if (typeof p.userId === 'string') {
              users.add(p.userId)
            }
          })
        })
        setOnlineUsers(users)
      })
      .subscribe()

    return () => {
      if (supabase) supabase.removeChannel(channel)
    }
  }, [setOnlineUsers])

  const trackPresence = (userId: string, username: string) => {
    if (!supabase) return
    const channel = supabase.channel('online-users')
    channel.track({
      userId,
      username,
      online_at: new Date().toISOString(),
    })
  }

  return { trackPresence }
}
