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
        'mode': 'payment',
        'line_items[0][price]': 'price_1SsJFaDFDOh4UH0dk4ACImvm',
        'line_items[0][quantity]': '1',
        'success_url': 'https://highvaluecapital.netlify.app/merci',
        'cancel_url': 'https://highvaluecapital.netlify.app/',
        'allow_promotion_codes': 'true',
        'billing_address_collection': 'auto',
      }).toString(),
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
