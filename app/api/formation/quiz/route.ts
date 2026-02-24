import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/app/lib/session'
import { getQuizResults, upsertQuizResult } from '@/app/lib/supabase-server'
import { getQuizForClient, gradeQuiz } from '@/app/lib/quizzes'
import { assignRole } from '@/app/lib/discord-api'
import { MODULES } from '@/app/lib/lessons'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const moduleId = req.nextUrl.searchParams.get('moduleId')
  const results = req.nextUrl.searchParams.get('results')

  if (results === 'true') {
    const { data, error } = await getQuizResults(session.userId)
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json({ results: data || [] })
  }

  if (!moduleId) {
    return NextResponse.json({ error: 'moduleId required' }, { status: 400 })
  }

  const quiz = getQuizForClient(moduleId)
  if (!quiz) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
  }

  return NextResponse.json(quiz)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { moduleId, answers } = await req.json()
  if (!moduleId || !answers) {
    return NextResponse.json({ error: 'moduleId and answers required' }, { status: 400 })
  }

  // Grade the quiz server-side
  const result = gradeQuiz(moduleId, answers)

  // Save result
  await upsertQuizResult(session.userId, moduleId, result.score, result.passed)

  // If passed, assign Discord role
  if (result.passed) {
    const module = MODULES.find(m => m.id === moduleId)
    if (module) {
      await assignRole(session.discordId, module.rewardRole)
    }
  }

  return NextResponse.json(result)
}
