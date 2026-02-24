import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/app/lib/session'

const SUPABASE_PROJECT_REF = 'ogsimsfqwibcmotaeevb'
const SUPABASE_STORAGE_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object`

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const EXT_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  if (!serviceKey) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Corps de requete invalide' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 })
  }

  // Validate type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Type de fichier non autorise. Formats acceptes : JPEG, PNG, GIF, WebP' },
      { status: 400 }
    )
  }

  // Validate size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: 'Fichier trop volumineux. Taille maximale : 5MB' },
      { status: 400 }
    )
  }

  // Build storage path: {userId}/{timestamp}-{random}.{ext}
  const ext = EXT_MAP[file.type] ?? 'jpg'
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 8)
  const storagePath = `${session.userId}/${timestamp}-${random}.${ext}`

  // Upload to Supabase Storage via raw fetch
  const fileBuffer = await file.arrayBuffer()
  const uploadRes = await fetch(
    `${SUPABASE_STORAGE_URL}/community-uploads/${storagePath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': file.type,
        'x-upsert': 'true',
      },
      body: fileBuffer,
    }
  )

  if (!uploadRes.ok) {
    const errText = await uploadRes.text()
    console.error('[Upload] Supabase Storage error:', uploadRes.status, errText)
    return NextResponse.json({ error: 'Echec du telechargement' }, { status: 500 })
  }

  // Build public URL then wrap with wsrv.nl proxy
  const supabasePublicUrl = `https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/community-uploads/${storagePath}`
  const optimizedUrl = `https://wsrv.nl/?url=${encodeURIComponent(supabasePublicUrl)}&w=800&q=75&output=webp`

  return NextResponse.json({ url: optimizedUrl })
}
