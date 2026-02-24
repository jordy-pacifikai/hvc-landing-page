import type { Metadata, Viewport } from 'next'
import CommunityLayoutClient from './CommunityLayoutClient'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#d4af37',
}

export const metadata: Metadata = {
  title: 'Communaute | High Value Capital',
  description: 'Rejoins la communaute HVC. Chat, forum, analyses, et plus encore.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HVC Community',
  },
}

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <CommunityLayoutClient>{children}</CommunityLayoutClient>
}
