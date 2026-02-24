'use client'

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
    staleTime: 10_000,
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()
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
    onSuccess: () => {
      // Messages will be added via Realtime subscription, but invalidate to be safe
      queryClient.invalidateQueries({ queryKey: ['community', 'messages'] })
    },
  })
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
