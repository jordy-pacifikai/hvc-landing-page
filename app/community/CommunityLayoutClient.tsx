'use client'

import { useEffect } from 'react'
import { useSession } from '@/app/lib/formation-hooks'
import { useCommunityStore } from '@/app/lib/community-store'
import { useChannels } from '@/app/lib/community-hooks'
import ChannelSidebar from '@/app/components/community/ChannelSidebar'
import MembersSidebar from '@/app/components/community/MembersSidebar'
import CommunityHeader from '@/app/components/community/CommunityHeader'
import SearchModal from '@/app/components/community/SearchModal'

export default function CommunityLayoutClient({ children }: { children: React.ReactNode }) {
  const { data: session, isLoading: sessionLoading } = useSession()
  const { sidebarOpen, membersSidebarOpen, setSearchOpen, searchOpen } = useCommunityStore()
  const { data: channels } = useChannels()
  const { setChannels } = useCommunityStore()

  useEffect(() => {
    if (channels) {
      setChannels(channels)
    }
  }, [channels, setChannels])

  // Cmd+K / Ctrl+K global listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(!searchOpen)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [searchOpen, setSearchOpen])

  // Not authenticated — show login screen
  if (!sessionLoading && !session?.authenticated) {
    return (
      <div className="min-h-screen bg-[var(--color-void)] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div>
            <h1 className="font-display text-4xl font-bold text-ivory mb-3">
              Communaute HVC
            </h1>
            <p className="text-mist text-lg">
              Rejoins la communaute des traders High Value Capital.
              Chat en temps reel, analyses, forum et plus encore.
            </p>
          </div>
          <a
            href="/api/auth/login?state=community"
            className="btn-primary inline-flex items-center gap-3 text-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            <span>Connexion avec Discord</span>
          </a>
          <p className="text-mist/60 text-sm">
            Utilise ton compte Discord pour acceder a la communaute.
          </p>
        </div>
      </div>
    )
  }

  // Loading state — skeleton layout
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-void)] flex items-center justify-center">
        <div className="w-full h-screen">
          {/* Skeleton layout mimicking 3 columns */}
          <div className="flex gap-0 h-full">
            <div className="w-[260px] bg-[var(--color-obsidian)] shrink-0 p-4 space-y-3 hidden lg:block">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 rounded-md"
                  style={{
                    background:
                      'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
                    backgroundSize: '800px 100%',
                    animation: 'shimmer 1.8s ease-in-out infinite',
                  }}
                />
              ))}
            </div>
            <div className="flex-1 bg-[var(--color-void)] p-4 space-y-4">
              {/* Header skeleton */}
              <div
                className="h-12 rounded-md w-full"
                style={{
                  background:
                    'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
                  backgroundSize: '800px 100%',
                  animation: 'shimmer 1.8s ease-in-out infinite',
                }}
              />
              {/* Message skeletons */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div
                    className="w-10 h-10 rounded-full shrink-0"
                    style={{
                      background:
                        'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
                      backgroundSize: '800px 100%',
                      animation: 'shimmer 1.8s ease-in-out infinite',
                    }}
                  />
                  <div className="flex-1 space-y-2">
                    <div
                      className="h-4 w-32 rounded"
                      style={{
                        background:
                          'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
                        backgroundSize: '800px 100%',
                        animation: 'shimmer 1.8s ease-in-out infinite',
                      }}
                    />
                    <div
                      className="h-4 w-3/4 rounded"
                      style={{
                        background:
                          'linear-gradient(90deg, var(--color-charcoal) 25%, var(--color-slate) 37%, var(--color-charcoal) 63%)',
                        backgroundSize: '800px 100%',
                        animation: 'shimmer 1.8s ease-in-out infinite',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex overflow-hidden bg-[var(--color-void)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => useCommunityStore.getState().setSidebarOpen(false)}
        />
      )}

      {/* Channel Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[260px] bg-[var(--color-obsidian)] border-r border-[rgba(99,102,241,0.08)]
          transform transition-transform duration-300 ease-smooth
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        <ChannelSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <CommunityHeader />
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>

      {/* Members Sidebar */}
      <aside
        className={`
          hidden xl:block w-[240px] bg-[var(--color-obsidian)] border-l border-[rgba(99,102,241,0.08)]
          shrink-0 overflow-y-auto
          ${membersSidebarOpen ? '' : 'xl:hidden'}
        `}
      >
        <MembersSidebar />
      </aside>

      {/* Search Modal — rendered at layout level, z-[100] */}
      <SearchModal />
    </div>
  )
}
