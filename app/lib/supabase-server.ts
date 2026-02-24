const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!

interface SupabaseResponse<T = unknown> {
  data: T | null
  error: string | null
}

async function supabaseFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<SupabaseResponse<T>> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...options.headers,
    },
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`[Supabase] ${res.status}: ${err}`)
    return { data: null, error: err }
  }

  const data = await res.json()
  return { data, error: null }
}

// --- Users ---

export async function upsertUser(discordId: string, discordUsername: string, discordAvatar: string | null, isPremium: boolean) {
  return supabaseFetch('hvc_users', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({
      discord_id: discordId,
      discord_username: discordUsername,
      discord_avatar: discordAvatar,
      is_premium: isPremium,
      last_login_at: new Date().toISOString(),
    }),
  })
}

export async function getUserByDiscordId(discordId: string) {
  return supabaseFetch(`hvc_users?discord_id=eq.${discordId}&select=*`, {
    method: 'GET',
    headers: { Accept: 'application/vnd.pgrst.object+json' },
  })
}

// --- Lesson Progress ---

export async function getLessonProgress(userId: string) {
  return supabaseFetch<Array<{ lesson_id: string; completed_at: string }>>(
    `hvc_lesson_progress?user_id=eq.${userId}&select=lesson_id,completed_at`,
    { method: 'GET' }
  )
}

export async function markLessonComplete(userId: string, lessonId: string) {
  return supabaseFetch('hvc_lesson_progress', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({
      user_id: userId,
      lesson_id: lessonId,
    }),
  })
}

// --- Quiz Results ---

export async function getQuizResults(userId: string) {
  return supabaseFetch<Array<{ module_id: string; score: number; passed: boolean; attempts: number; completed_at: string }>>(
    `hvc_quiz_results?user_id=eq.${userId}&select=module_id,score,passed,attempts,completed_at`,
    { method: 'GET' }
  )
}

export async function upsertQuizResult(userId: string, moduleId: string, score: number, passed: boolean) {
  // First check if exists
  const existing = await supabaseFetch<Array<{ id: string; attempts: number }>>(
    `hvc_quiz_results?user_id=eq.${userId}&module_id=eq.${moduleId}&select=id,attempts`,
    { method: 'GET' }
  )

  if (existing.data && existing.data.length > 0) {
    // Update existing
    return supabaseFetch(`hvc_quiz_results?id=eq.${existing.data[0].id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        score,
        passed,
        attempts: existing.data[0].attempts + 1,
        completed_at: new Date().toISOString(),
      }),
    })
  }

  // Insert new
  return supabaseFetch('hvc_quiz_results', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      module_id: moduleId,
      score,
      passed,
    }),
  })
}
