// Captures UTM params from URL and stores them in sessionStorage
// So they persist across page navigations within a session

export interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  referrer?: string
}

export function captureUTM(): UTMParams {
  if (typeof window === 'undefined') return {}

  const params = new URLSearchParams(window.location.search)
  const utm: UTMParams = {}

  // Capture from URL params
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
  for (const key of keys) {
    const value = params.get(key)
    if (value) {
      utm[key] = value
      sessionStorage.setItem(key, value)
    } else {
      // Fall back to stored value
      const stored = sessionStorage.getItem(key)
      if (stored) utm[key] = stored
    }
  }

  // Capture referrer on first visit
  if (document.referrer && !sessionStorage.getItem('referrer')) {
    sessionStorage.setItem('referrer', document.referrer)
  }
  utm.referrer = sessionStorage.getItem('referrer') || undefined

  return utm
}

export function getStoredUTM(): UTMParams {
  if (typeof window === 'undefined') return {}

  return {
    utm_source: sessionStorage.getItem('utm_source') || undefined,
    utm_medium: sessionStorage.getItem('utm_medium') || undefined,
    utm_campaign: sessionStorage.getItem('utm_campaign') || undefined,
    utm_content: sessionStorage.getItem('utm_content') || undefined,
    utm_term: sessionStorage.getItem('utm_term') || undefined,
    referrer: sessionStorage.getItem('referrer') || undefined,
  }
}
