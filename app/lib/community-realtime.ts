'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabase-client'
import { useCommunityStore } from './community-store'
import type { Message } from './community-api'
import { useQueryClient } from '@tanstack/react-query'

export type RealtimeStatus = 'connecting' | 'connected' | 'disconnected'

export function useCommunityRealtime(channelId: string | null) {
  const queryClient = useQueryClient()
  const setRealtimeConnected = useCommunityStore((s) => s.setRealtimeConnected)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null)
  const [status, setStatus] = useState<RealtimeStatus>('connecting')

  useEffect(() => {
    if (!channelId || !supabase) {
      setStatus('disconnected')
      return
    }

    setStatus('connecting')

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
          queryClient.invalidateQueries({ queryKey: ['community', 'messages'] })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'hvc_messages',
          filter: `channel_id=eq.${channelId}`,
        },
        () => {
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
      .subscribe((s) => {
        if (s === 'SUBSCRIBED') { setStatus('connected'); setRealtimeConnected(true) }
        else if (s === 'CLOSED' || s === 'CHANNEL_ERROR') { setStatus('disconnected'); setRealtimeConnected(false) }
        else setStatus('connecting')
      })

    channelRef.current = channel

    return () => {
      if (channelRef.current && supabase) {
        supabase.removeChannel(channelRef.current)
      }
      setStatus('disconnected')
    }
  }, [channelId, queryClient])

  return { status }
}

export function useTypingBroadcast(channelId: string | null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null)
  const addTypingUser = useCommunityStore((s) => s.addTypingUser)
  const removeTypingUser = useCommunityStore((s) => s.removeTypingUser)

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
  const setOnlineUsers = useCommunityStore((s) => s.setOnlineUsers)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const presenceRef = useRef<any>(null)
  const subscribedRef = useRef(false)

  useEffect(() => {
    if (!supabase) return

    const channel = supabase.channel('online-users')
    presenceRef.current = channel

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const users: string[] = []
        Object.values(state).forEach((presences) => {
          presences.forEach((p: Record<string, unknown>) => {
            if (typeof p.userId === 'string') {
              users.push(p.userId)
            }
          })
        })
        setOnlineUsers(users)
      })
      .subscribe((status) => {
        subscribedRef.current = status === 'SUBSCRIBED'
      })

    return () => {
      subscribedRef.current = false
      if (supabase) supabase.removeChannel(channel)
      presenceRef.current = null
    }
  }, [setOnlineUsers])

  const trackPresence = (userId: string, username: string) => {
    if (!presenceRef.current || !subscribedRef.current) return
    presenceRef.current.track({
      userId,
      username,
      online_at: new Date().toISOString(),
    })
  }

  return { trackPresence }
}
