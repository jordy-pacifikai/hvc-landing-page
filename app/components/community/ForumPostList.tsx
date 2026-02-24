'use client'

interface ForumPostListProps {
  channelSlug: string
  channel: {
    id: string
    name: string
    icon: string | null
  }
}

export default function ForumPostList({ channelSlug, channel }: ForumPostListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-ivory">
            {channel.icon} {channel.name}
          </h2>
          <button className="btn-primary text-sm px-4 py-2">
            <span>Nouveau post</span>
          </button>
        </div>
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-mist">Aucun post pour l&apos;instant.</p>
          <p className="text-mist/60 text-sm mt-1">Cree le premier post dans ce forum !</p>
        </div>
      </div>
    </div>
  )
}
