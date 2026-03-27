import { NextRequest, NextResponse } from 'next/server'

// MIGRATION: Stan Store replaces Stripe checkout
// All checkout requests now redirect to Stan Store.
// Stripe session creation is disabled.
const STAN_STORE_URL = 'https://stan.store/highvaluecapital'

export async function POST(req: NextRequest) {
  // Redirect all checkout requests to Stan Store
  return NextResponse.json({ url: STAN_STORE_URL })
}

export async function GET(req: NextRequest) {
  return NextResponse.redirect(STAN_STORE_URL)
}

/* ── STRIPE LEGACY (disabled) ──────────────────────────────────
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

const PRICES: Record<string, { priceId: string; mode: 'payment' | 'subscription' }> = {
  test: { priceId: 'price_1T98h7DFDOh4UH0d1bolcEQf', mode: 'payment' },
  monthly: { priceId: 'price_1T3XqIDFDOh4UH0d1crOCUUU', mode: 'subscription' },
  yearly: { priceId: 'price_1T98hGDFDOh4UH0dD6kh4MMc', mode: 'subscription' },
}
────────────────────────────────────────────────────────────── */
