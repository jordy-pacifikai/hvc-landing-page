import type { Metadata } from 'next'
import CommunityLayoutClient from './CommunityLayoutClient'

export const metadata: Metadata = {
  title: 'Communaute | High Value Capital',
  description: 'Rejoins la communaute HVC. Chat, forum, analyses, et plus encore.',
}

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <CommunityLayoutClient>{children}</CommunityLayoutClient>
}
