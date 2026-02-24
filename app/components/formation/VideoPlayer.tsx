'use client'

export default function VideoPlayer({ url }: { url: string }) {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[var(--color-charcoal)]">
      <iframe
        src={url}
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture"
      />
    </div>
  )
}
