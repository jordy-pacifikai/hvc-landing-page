'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSession, fetchProgress, markComplete, submitQuiz, fetchQuiz, fetchQuizResults } from './formation-api'

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    retry: 2,
    staleTime: 60_000,
  })
}

export function useProgress() {
  return useQuery({
    queryKey: ['progress'],
    queryFn: fetchProgress,
    retry: false,
  })
}

export function useMarkComplete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (lessonId: string) => markComplete(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] })
    },
  })
}

export function useQuiz(moduleId: string) {
  return useQuery({
    queryKey: ['quiz', moduleId],
    queryFn: () => fetchQuiz(moduleId),
    enabled: !!moduleId,
  })
}

export function useQuizResults() {
  return useQuery({
    queryKey: ['quizResults'],
    queryFn: fetchQuizResults,
    retry: false,
  })
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ moduleId, answers }: { moduleId: string; answers: Record<string, number> }) =>
      submitQuiz(moduleId, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizResults'] })
    },
  })
}
