import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import {
  fetchChannels,
  fetchMessages,
  sendMessage,
  editMessage,
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
  fetchMembers,
} from './community-api'
import type { Notification, Member } from './community-api'
import type { InfiniteMessages } from './community-types'
import { useCommunityStore } from './community-store'

export function useChannels() {
  return useQuery({
    queryKey: ['community', 'channels'],
    queryFn: fetchChannels,
    staleTime: 30_000,
  })
}

export function useMembers() {
  return useQuery<Member[]>({
    queryKey: ['community', 'members'],
    queryFn: fetchMembers,
    staleTime: 60_000,
    refetchInterval: 60_000,
  })
}

export function useMessages(channelSlug: string) {
  // Reduce polling when Realtime is connected (5s → 30s)
  const realtimeConnected = useCommunityStore((s) => s.realtimeConnected)

  return useInfiniteQuery({
    queryKey: ['community', 'messages', channelSlug],
    queryFn: ({ pageParam }) => fetchMessages(channelSlug, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore || !lastPage.messages.length) return undefined
      return lastPage.messages[lastPage.messages.length - 1].created_at
    },
    enabled: !!channelSlug,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchInterval: realtimeConnected ? 30_000 : 5_000,
    refetchIntervalInBackground: false,
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
    queryClient.setQueryData<InfiniteMessages>(
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
          queryClient.setQueryData<InfiniteMessages>(
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
          queryClient.setQueryData<InfiniteMessages>(
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

export function useEditMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ messageId, content }: { messageId: string; content: string }) =>
      editMessage(messageId, content),
    onSuccess: () => {
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

function updateReactionInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  messageId: string,
  emoji: string,
  action: 'add' | 'remove'
) {
  // Update all message query caches (any channel slug)
  queryClient.setQueriesData<InfiniteMessages>(
    { queryKey: ['community', 'messages'] },
    (old) => {
      if (!old) return old
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          messages: page.messages.map((m) => {
            if (m.id !== messageId) return m
            const reactions = [...(m.reactions || [])]
            const idx = reactions.findIndex((r) => r.emoji === emoji)
            if (action === 'add') {
              if (idx >= 0) {
                reactions[idx] = { ...reactions[idx], count: reactions[idx].count + 1, has_reacted: true }
              } else {
                reactions.push({ emoji, count: 1, has_reacted: true })
              }
            } else {
              if (idx >= 0) {
                if (reactions[idx].count <= 1) {
                  reactions.splice(idx, 1)
                } else {
                  reactions[idx] = { ...reactions[idx], count: reactions[idx].count - 1, has_reacted: false }
                }
              }
            }
            return { ...m, reactions }
          }),
        })),
      }
    }
  )
}

export function useAddReaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ messageId, emoji }: { messageId: string; emoji: string }) =>
      addReaction(messageId, emoji),
    onMutate: ({ messageId, emoji }) => {
      updateReactionInCache(queryClient, messageId, emoji, 'add')
    },
    onError: (_err, { messageId, emoji }) => {
      // Rollback
      updateReactionInCache(queryClient, messageId, emoji, 'remove')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['community', 'messages'] })
    },
  })
}

export function useRemoveReaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ messageId, emoji }: { messageId: string; emoji: string }) =>
      removeReaction(messageId, emoji),
    onMutate: ({ messageId, emoji }) => {
      updateReactionInCache(queryClient, messageId, emoji, 'remove')
    },
    onError: (_err, { messageId, emoji }) => {
      // Rollback
      updateReactionInCache(queryClient, messageId, emoji, 'add')
    },
    onSettled: () => {
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
