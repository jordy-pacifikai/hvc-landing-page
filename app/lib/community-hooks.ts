'use client'

import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import {
  fetchChannels,
  fetchMessages,
  sendMessage,
  deleteMessage,
  addReaction,
  removeReaction,
  markChannelRead,
  fetchForumPosts,
  createForumPost,
  fetchForumPost,
  addForumComment,
  fetchNotifications,
  markNotificationsRead,
  searchCommunity,
} from './community-api'
import type { Notification } from './community-api'

export function useChannels() {
  return useQuery({
    queryKey: ['community', 'channels'],
    queryFn: fetchChannels,
    staleTime: 30_000,
  })
}

export function useMessages(channelSlug: string) {
  return useInfiniteQuery({
    queryKey: ['community', 'messages', channelSlug],
    queryFn: ({ pageParam }) => fetchMessages(channelSlug, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore || !lastPage.messages.length) return undefined
      return lastPage.messages[lastPage.messages.length - 1].created_at
    },
    enabled: !!channelSlug,
    staleTime: 0, // Always refetch when invalidated
    refetchOnWindowFocus: false, // Don't refetch on tab switch (would flicker optimistic messages)
    // Fallback polling every 5s — ensures new messages from other users appear
    // even if Supabase Realtime postgres_changes requires a paid plan
    refetchInterval: 5000,
    refetchIntervalInBackground: false, // Only poll when tab is active
  })
}

export function useSendMessage() {
  return useMutation({
    mutationFn: ({
      channelId,
      content,
      replyTo,
      imageUrl,
    }: {
      channelId: string
      content: string
      replyTo?: string
      imageUrl?: string
    }) => sendMessage(channelId, content, replyTo, imageUrl),
    // No global onSuccess invalidation — MessageInput handles optimistic updates directly.
    // Invalidation here would race against the optimistic setQueryData and cause message flicker.
  })
}

// Retry a failed message: marks it pending again, resends, updates or marks failed
export function useRetryMessage(channelSlug: string) {
  const queryClient = useQueryClient()
  const { mutate: send } = useSendMessage()

  return useCallback((failedMsg: { id: string; channel_id: string; failedContent: string }) => {
    // Set back to pending
    queryClient.setQueryData<{ pages: { messages: import('./community-api').Message[]; hasMore: boolean }[]; pageParams: unknown[] }>(
      ['community', 'messages', channelSlug],
      (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            messages: page.messages.map((m) =>
              m.id === failedMsg.id ? { ...m, pending: true, failed: false } : m
            ),
          })),
        }
      }
    )

    send(
      { channelId: failedMsg.channel_id, content: failedMsg.failedContent },
      {
        onSuccess: (serverMsg) => {
          queryClient.setQueryData<{ pages: { messages: import('./community-api').Message[]; hasMore: boolean }[]; pageParams: unknown[] }>(
            ['community', 'messages', channelSlug],
            (old) => {
              if (!old) return old
              return {
                ...old,
                pages: old.pages.map((page) => ({
                  ...page,
                  messages: page.messages.map((m) =>
                    m.id === failedMsg.id ? { ...serverMsg, pending: false, failed: false } : m
                  ),
                })),
              }
            }
          )
        },
        onError: () => {
          queryClient.setQueryData<{ pages: { messages: import('./community-api').Message[]; hasMore: boolean }[]; pageParams: unknown[] }>(
            ['community', 'messages', channelSlug],
            (old) => {
              if (!old) return old
              return {
                ...old,
                pages: old.pages.map((page) => ({
                  ...page,
                  messages: page.messages.map((m) =>
                    m.id === failedMsg.id ? { ...m, pending: false, failed: true } : m
                  ),
                })),
              }
            }
          )
        },
      }
    )
  }, [queryClient, channelSlug, send])
}

export function useDeleteMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (messageId: string) => deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', 'messages'] })
    },
  })
}

export function useAddReaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ messageId, emoji }: { messageId: string; emoji: string }) =>
      addReaction(messageId, emoji),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', 'messages'] })
    },
  })
}

export function useRemoveReaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ messageId, emoji }: { messageId: string; emoji: string }) =>
      removeReaction(messageId, emoji),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', 'messages'] })
    },
  })
}

export function useMarkChannelRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (channelSlug: string) => markChannelRead(channelSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', 'channels'] })
    },
  })
}

export function useForumPosts(channelSlug: string) {
  return useInfiniteQuery({
    queryKey: ['community', 'forum', channelSlug],
    queryFn: ({ pageParam }) => fetchForumPosts(channelSlug, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore || !lastPage.posts.length) return undefined
      return lastPage.posts[lastPage.posts.length - 1].created_at
    },
    enabled: !!channelSlug,
    staleTime: 30_000,
  })
}

export function useCreateForumPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ channelId, title, content }: { channelId: string; title: string; content: string }) =>
      createForumPost(channelId, title, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', 'forum'] })
    },
  })
}

export function useForumPost(postId: string) {
  return useQuery({
    queryKey: ['community', 'forum', 'post', postId],
    queryFn: () => fetchForumPost(postId),
    enabled: !!postId,
  })
}

export function useAddForumComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      addForumComment(postId, content),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community', 'forum', 'post', variables.postId] })
    },
  })
}

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ['community', 'notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 30_000,
  })
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => markNotificationsRead(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', 'notifications'] })
    },
  })
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['community', 'search', query],
    queryFn: () => searchCommunity(query),
    enabled: query.length >= 2,
    staleTime: 60_000,
  })
}
