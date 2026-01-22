import { NextResponse } from 'next/server'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

export async function POST() {
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe configuration missing' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'ui_mode': 'embedded',
        'mode': 'payment',
        'line_items[0][price]': 'price_1SsJFaDFDOh4UH0dk4ACImvm',
        'line_items[0][quantity]': '1',
        'return_url': 'https://highvaluecapital.netlify.app/merci?session_id={CHECKOUT_SESSION_ID}',
        'allow_promotion_codes': 'true',
        'billing_address_collection': 'auto',
      }).toString(),
    })

    const session = await response.json()

    if (!response.ok) {
      throw new Error(session.error?.message || 'Failed to create checkout session')
    }

    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
