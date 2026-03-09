import { NextRequest, NextResponse } from 'next/server'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

const PRICES: Record<string, { priceId: string; mode: 'payment' | 'subscription' }> = {
  test: { priceId: 'price_1T98h7DFDOh4UH0d1bolcEQf', mode: 'payment' },
  monthly: { priceId: 'price_1T3XqIDFDOh4UH0d1crOCUUU', mode: 'subscription' },
  yearly: { priceId: 'price_1T98hGDFDOh4UH0dD6kh4MMc', mode: 'subscription' },
}

export async function POST(req: NextRequest) {
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe configuration missing' },
      { status: 500 }
    )
  }

  try {
    const body = await req.json().catch(() => ({}))
    const plan = body.plan || 'monthly'
    const priceConfig = PRICES[plan]

    if (!priceConfig) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const origin = req.headers.get('origin') || 'https://www.highvaluecapital.club'

    const params: Record<string, string> = {
      'mode': priceConfig.mode,
      'line_items[0][price]': priceConfig.priceId,
      'line_items[0][quantity]': '1',
      'success_url': `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${origin}/${plan === 'test' ? 'test-checkout' : 'checkout'}`,
      'allow_promotion_codes': 'true',
      'metadata[plan]': plan,
    }

    if (priceConfig.mode === 'subscription') {
      params['subscription_data[metadata][plan]'] = plan
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

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
