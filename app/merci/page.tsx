'use client'

import { CheckCircle, MessageCircle, Video, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/logo-hvc-white.png"
            alt="High Value Capital"
            width={200}
            height={72}
            className="mx-auto"
          />
        </div>

        {/* Card principale */}
        <div className="bg-hvc-dark/50 border border-hvc-gold/20 rounded-2xl p-8 md:p-12 text-center backdrop-blur-sm">
          {/* Icon success */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-gold rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-hvc-dark" />
          </div>

          {/* Titre */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Bienvenue dans la{' '}
            <span className="text-gradient">High Value Family</span> ! 🎉
          </h1>

          {/* Message */}
          <p className="text-gray-300 text-lg mb-8">
            Ton paiement a été confirmé avec succès. Tu as maintenant accès à la{' '}
            <strong className="text-hvc-gold">Formation Trading Premium</strong>.
          </p>

          {/* Étapes suivantes */}
          <div className="bg-hvc-dark/80 border border-hvc-gold/10 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-hvc-gold" />
              Prochaines étapes
            </h2>

            <div className="space-y-4">
              {/* Étape 1 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-hvc-gold/20 rounded-full flex items-center justify-center text-hvc-gold font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email de confirmation en cours</h3>
                  <p className="text-gray-400 text-sm">
                    Vérifie ta boîte mail (et tes spams) pour ton reçu et tes accès Heartbeat.
                  </p>
                </div>
              </div>

              {/* Étape 2 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-hvc-gold/20 rounded-full flex items-center justify-center text-hvc-gold font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Rejoins la communauté Heartbeat</h3>
                  <p className="text-gray-400 text-sm">
                    Accède à tous les modules, lives hebdomadaires et groupe privé Premium.
                  </p>
                </div>
              </div>

              {/* Étape 3 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-hvc-gold/20 rounded-full flex items-center justify-center text-hvc-gold font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Démarre ta formation</h3>
                  <p className="text-gray-400 text-sm">
                    Commence par le Module 1 : Fondations ARD et progresse à ton rythme.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA principal */}
          <a
            href="https://www.community.highvaluecapital.club"
            className="inline-flex items-center gap-2 bg-gradient-gold text-hvc-dark font-bold px-8 py-4 rounded-lg text-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-hvc-gold/25 mb-6"
          >
            <MessageCircle className="w-5 h-5" />
            Accéder à Heartbeat
          </a>

          {/* Message support */}
          <p className="text-gray-400 text-sm">
            Un problème ? Contacte-nous directement sur{' '}
            <a
              href="https://www.community.highvaluecapital.club"
              className="text-hvc-gold hover:underline"
            >
              Heartbeat
            </a>{' '}
            ou par email.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <Link href="/" className="hover:text-hvc-gold transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
