// GA4 + Meta Pixel + PostHog event helpers
import { trackEvent } from './posthog'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

export function trackGA4Event(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, params)
  }
}

export function trackPixelEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, params)
  }
}

// Convenience: track on ALL platforms at once
export function trackConversion(event: string, params?: Record<string, unknown>) {
  trackGA4Event(event, params)
  trackPixelEvent(event, params)
  trackEvent(event, params)
}

// Specific funnel events
export function trackNewsletterSignup() {
  trackGA4Event('generate_lead', { method: 'newsletter' })
  trackPixelEvent('Lead', { content_name: 'Newsletter Signup' })
  trackEvent('newsletter_lead', { method: 'newsletter' })
}

export function trackCheckoutInitiated(value: number = 49) {
  trackGA4Event('begin_checkout', { value, currency: 'EUR' })
  trackPixelEvent('InitiateCheckout', { value, currency: 'EUR' })
  trackEvent('checkout_initiated', { value, currency: 'EUR' })
}

export function trackPurchaseCompleted(value: number = 49) {
  trackGA4Event('purchase', { value, currency: 'EUR', transaction_id: Date.now().toString() })
  trackPixelEvent('Purchase', { value, currency: 'EUR' })
  trackEvent('purchase_completed', { value, currency: 'EUR' })
}

export function trackChatOpened() {
  trackGA4Event('chat_opened')
  trackPixelEvent('Contact')
  trackEvent('chat_opened_conversion')
}

export function trackLeadCaptured(source: string) {
  trackGA4Event('generate_lead', { method: source })
  trackPixelEvent('Lead', { content_name: source })
  trackEvent('lead_captured_conversion', { source })
}
