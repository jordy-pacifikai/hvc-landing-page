import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/app/lib/session'
import { getLessonProgress, markLessonComplete } from '@/app/lib/supabase-server'

export async function GET() {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await getLessonProgress(session.userId)
  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ progress: data || [] })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { lessonId } = await req.json()
  if (!lessonId) {
    return NextResponse.json({ error: 'lessonId required' }, { status: 400 })
  }

  const { error } = await markLessonComplete(session.userId, lessonId)
  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
