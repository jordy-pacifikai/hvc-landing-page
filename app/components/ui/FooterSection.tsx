'use client'

import Image from 'next/image'

export default function FooterSection() {
  return (
    <footer className="py-10 border-t border-white/6">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Image
              src="/icon-hvc-gradient.png"
              alt="High Value Capital"
              width={40}
              height={40}
              className="mx-auto md:mx-0 mb-2 opacity-80"
            />
            <p className="text-ivory-dim text-sm">Formation Trading Forex</p>
          </div>

          <p className="text-ivory-ghost text-xs text-center max-w-md leading-relaxed">
            Le trading comporte des risques. Les résultats passés ne garantissent pas les résultats futurs.
            Investis uniquement ce que tu peux te permettre de perdre.
          </p>

          <div className="text-center md:text-right">
            <p className="text-ivory-ghost text-sm">
              © 2026 High Value Capital
            </p>
            <p className="text-ivory-ghost/50 text-xs mt-1">
              Site créé par{' '}
              <a
                href="https://pacifikai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                PACIFIK&apos;AI
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
