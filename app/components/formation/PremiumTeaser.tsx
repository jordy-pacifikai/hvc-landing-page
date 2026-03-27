'use client'

export default function PremiumTeaser() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-[var(--color-gold)]/10 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-[var(--color-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
      <h2 className="text-2xl font-display font-bold text-[var(--color-ivory)] mb-3">
        Contenu Premium
      </h2>
      <p className="text-[var(--color-mist)] max-w-md mb-8">
        Cette formation est reservee aux membres Premium. Rejoins la communaute HVC pour acceder aux 42 lecons, aux quiz et aux roles exclusifs.
      </p>
      <a
        href="/checkout"
        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
        style={{ background: 'linear-gradient(135deg, var(--color-champagne), var(--color-gold-light))' }}
      >
        Devenir Premium — 49EUR/mois
      </a>
    </div>
  )
}
