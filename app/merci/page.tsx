'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Sparkles, Mail, BookOpen, Shield, LogIn } from 'lucide-react'

export default function ThankYouPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-12">
      <div className="noise-overlay" />

      <div className="relative z-10 max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-10">
          <Image
            src="/logo-hvc-gradient.png"
            alt="High Value Capital"
            width={180}
            height={65}
            className="mx-auto"
          />
        </div>

        {/* Card principale */}
        <div className="bg-black-card border border-accent/30 p-8 md:p-12 rounded-2xl text-center">
          {/* Icon success */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-full mb-8">
            <CheckCircle className="w-12 h-12 text-accent" />
          </div>

          {/* Titre */}
          <h1 className="font-display text-3xl md:text-4xl font-medium mb-4 text-ivory">
            Bienvenue dans la{' '}
            <span className="italic text-accent-gradient">High Value Family</span> !
          </h1>

          {/* Message */}
          <p className="text-ivory-muted text-lg mb-10">
            Ton paiement a ete confirme avec succes. Ton acces{' '}
            <span className="text-accent font-medium">Premium</span>{' '}
            est active.
          </p>

          {/* Etapes suivantes */}
          <div className="bg-black-elevated border border-black-border rounded-xl p-6 md:p-8 mb-10 text-left">
            <h2 className="font-display text-xl font-medium mb-6 flex items-center gap-2 text-ivory">
              <Sparkles className="w-5 h-5 text-accent" />
              Prochaines etapes
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-ivory mb-1">Email de confirmation envoye</h3>
                  <p className="text-ivory-muted text-sm leading-relaxed">
                    Verifie ta boite mail (et tes spams) pour ton recu de paiement.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-ivory mb-1">Acces Premium active</h3>
                  <p className="text-ivory-muted text-sm leading-relaxed">
                    Connecte-toi avec l'email utilise pour le paiement. Tu recevras un code OTP pour acceder a la plateforme.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-ivory mb-1">Demarre ta formation</h3>
                  <p className="text-ivory-muted text-sm leading-relaxed">
                    Commence par le Module 1 : Fondations ARD et progresse a ton rythme.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Communaute */}
          <div>
            <a
              href="https://community.highvaluecapital.club/login"
              className="inline-flex items-center gap-2 py-4 px-8 bg-accent hover:bg-accent/90 text-black font-bold rounded-xl transition-all text-lg"
            >
              <LogIn className="w-5 h-5" />
              Se connecter
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>

            <p className="text-ivory-dim text-sm mt-6">
              Un probleme ? Ecris-nous a{' '}
              <a
                href="mailto:support@highvaluecapital.club"
                className="text-accent hover:underline"
              >
                support@highvaluecapital.club
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <Link
            href="/"
            className="text-ivory-dim hover:text-ivory transition-colors text-sm"
          >
            Retour a l'accueil
          </Link>
        </div>
      </div>
    </main>
  )
}
