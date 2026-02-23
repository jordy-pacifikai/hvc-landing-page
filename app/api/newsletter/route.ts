import { NextRequest, NextResponse } from 'next/server'

const BREVO_API_KEY = process.env.BREVO_API_KEY ?? ''

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email } = body as { name?: string; email?: string }

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
