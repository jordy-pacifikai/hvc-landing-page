import { NextRequest, NextResponse } from 'next/server'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

export async function POST(req: NextRequest) {
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe configuration missing' },
      { status: 500 }
    )
  }

  try {
    const body = await req.json().catch(() => ({}))
    const discordId = body.discord_id || ''
    const discordUsername = body.discord_username || ''
    const discordToken = body.discord_token || ''

    const params: Record<string, string> = {
      'mode': 'subscription',
      'line_items[0][price]': 'price_1T3XqIDFDOh4UH0d1crOCUUU',
      'line_items[0][quantity]': '1',
      'success_url': 'https://www.highvaluecapital.club/merci',
      'cancel_url': 'https://www.highvaluecapital.club/',
      'allow_promotion_codes': 'true',
      'billing_address_collection': 'auto',
    }

    // Store Discord info in subscription metadata
    if (discordId) {
      params['subscription_data[metadata][discord_user_id]'] = discordId
      params['subscription_data[metadata][discord_username]'] = discordUsername
      params['subscription_data[metadata][discord_token]'] = discordToken
      params['metadata[discord_user_id]'] = discordId
      params['metadata[discord_username]'] = discordUsername
    }

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params).toString(),
    })

    const session = await response.json()

    if (!response.ok) {
      throw new Error(session.error?.message || 'Failed to create checkout session')
    }

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
