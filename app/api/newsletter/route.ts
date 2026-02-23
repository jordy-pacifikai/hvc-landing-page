import { NextRequest, NextResponse } from 'next/server'

const BREVO_API_KEY = process.env.BREVO_API_KEY ?? ''
const SUPABASE_URL = process.env.SUPABASE_URL ?? ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY ?? ''

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer } = body as {
      name?: string
      email?: string
      utm_source?: string
      utm_medium?: string
      utm_campaign?: string
      utm_content?: string
      utm_term?: string
      referrer?: string
    }

    // Validate presence
    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: 'Prenom et email requis.' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Adresse email invalide.' },
        { status: 400 }
      )
    }

    // Fire-and-forget: save to Supabase for attribution tracking
    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      fetch(`${SUPABASE_URL}/rest/v1/hvc_leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          source: 'newsletter',
          ip_address: clientIp,
          utm_source: utm_source || null,
          utm_medium: utm_medium || null,
          utm_campaign: utm_campaign || null,
          utm_content: utm_content || null,
          utm_term: utm_term || null,
          referrer: referrer || null,
        }),
        signal: AbortSignal.timeout(8_000),
      }).catch(() => {
        console.error('[newsletter] Supabase lead save failed')
      })
    }

    // POST to Brevo
    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        attributes: { PRENOM: name.trim() },
        listIds: [3],
        updateEnabled: true,
      }),
    })

    // 201 = created, 204 = updated (updateEnabled)
    if (brevoRes.status === 201 || brevoRes.status === 204) {
      return NextResponse.json({ success: true })
    }

    // Brevo returns 400 with "Contact already exist" when contact exists
    // but updateEnabled: true should handle that — still guard it
    if (brevoRes.status === 400) {
      const errorBody = await brevoRes.json().catch(() => ({}))
      const message: string = errorBody?.message ?? ''

      if (
        message.toLowerCase().includes('already exist') ||
        message.toLowerCase().includes('contact already')
      ) {
        // Treat as success — contact is already in the list
        return NextResponse.json({ success: true })
      }

      return NextResponse.json(
        { success: false, error: 'Email invalide ou deja inscrit.' },
        { status: 400 }
      )
    }

    // Any other non-success status
    const errorBody = await brevoRes.json().catch(() => ({}))
    console.error('[newsletter] Brevo error:', brevoRes.status, errorBody)

    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'inscription. Reessaie.' },
      { status: 500 }
    )
  } catch (err) {
    console.error('[newsletter] Unexpected error:', err)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur. Reessaie.' },
      { status: 500 }
    )
  }
}
