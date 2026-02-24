import { NextRequest, NextResponse } from 'next/server'
import { getSessionWithPremium as getSession } from '@/app/lib/session'
import { getForumPostById, getForumComments, createForumCommentDb } from '@/app/lib/community-server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const [postResult, commentsResult] = await Promise.all([
    getForumPostById(id),
    getForumComments(id),
  ])

  if (postResult.error || !postResult.data) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json({
    post: postResult.data,
    comments: commentsResult.data || [],
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session.userId || !session.isPremium) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { content } = await request.json()

  if (!content) {
    return NextResponse.json({ error: 'Missing content' }, { status: 400 })
  }

  const result = await createForumCommentDb(id, session.userId, content)
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json(result.data)
}
