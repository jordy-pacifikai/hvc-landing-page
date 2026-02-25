// Client-side fetch helpers for formation pages

function apiFetch(url: string, init?: RequestInit): Promise<Response> {
  return fetch(url, { credentials: 'include', ...init })
}

export async function fetchSession() {
  const res = await apiFetch('/api/auth/session')
  if (!res.ok) return null
  return res.json()
}

export async function fetchProgress() {
  const res = await apiFetch('/api/formation/progress')
  if (!res.ok) return null
  return res.json()
}

export async function markComplete(lessonId: string) {
  const res = await apiFetch('/api/formation/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lessonId }),
  })
  if (!res.ok) throw new Error('Failed to mark lesson complete')
  return res.json()
}

export async function submitQuiz(moduleId: string, answers: Record<string, number>) {
  const res = await apiFetch('/api/formation/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ moduleId, answers }),
  })
  if (!res.ok) throw new Error('Failed to submit quiz')
  return res.json()
}

export async function fetchQuiz(moduleId: string) {
  const res = await apiFetch(`/api/formation/quiz?moduleId=${moduleId}`)
  if (!res.ok) return null
  return res.json()
}

export async function fetchQuizResults() {
  const res = await apiFetch('/api/formation/quiz?results=true')
  if (!res.ok) return null
  return res.json()
}

export async function logout() {
  await apiFetch('/api/auth/session', { method: 'DELETE' })
  window.location.href = '/formation'
}
