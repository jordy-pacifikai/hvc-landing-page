export interface Lesson {
  id: string
  moduleId: string
  number: number
  title: string
  description: string
  type: 'video' | 'text'
  videoUrl: string | null
  document: string | null
}

export interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  quizThreshold: number
  rewardRole: string
  rewardRoleName: string
}

export const MODULES: Module[] = [
  {
    id: 'module-1',
    title: 'Les Bases',
    description: 'Les fondamentaux du Forex Trading : terminologies, plateformes, gestion du risque.',
    quizThreshold: 70,
    rewardRole: '1472515214636482734', // @Trader
    rewardRoleName: 'Trader',
    lessons: [
      {
        id: 'm1-01', moduleId: 'module-1', number: 1,
        title: 'Introduction / Roadmap',
        description: 'Bienvenue dans la formation Les Bases ! Decouvre la roadmap de ton parcours trading.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/7091d7b81215eac1f9/4cce77c578a381af',
        document: 'Roadmap.png',
      },
      {
        id: 'm1-02', moduleId: 'module-1', number: 2,
        title: 'Les fondamentaux du Forex Trading',
        description: 'Comprends ce quest le Forex et comment fonctionne ce marche mondial. Le plus grand marche financier avec 6.6 trillions de dollars echanges par jour.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/d391d7b8121aedce5a/c0f89b01fe85007c',
        document: null,
      },
      {
        id: 'm1-03', moduleId: 'module-1', number: 3,
        title: 'Les avantages du Forex Trading',
        description: 'Pourquoi le Forex est le marche le plus accessible et le plus liquide au monde.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/ea91d7b71c15e9c163/02b5144a1a10bea7',
        document: 'Pourquoi Trader le Forex.png',
      },
      {
        id: 'm1-04', moduleId: 'module-1', number: 4,
        title: 'Les terminologies',
        description: 'Pip, lot, spread, leverage, marge... Tous les termes essentiels du trading expliques simplement.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/1191d7b71c15e8cf98/993d72baebdcdd5e',
        document: 'Les Terminologies - High Value Capital.pdf',
      },
      {
        id: 'm1-05', moduleId: 'module-1', number: 5,
        title: 'Les differentes paires de devises',
        description: 'Majeures, mineures, exotiques. Comment choisir ta paire de devises.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/d391d7b71d1ce6c35a/a034f5f65332cf21',
        document: 'Paires de Devises.png',
      },
      {
        id: 'm1-06', moduleId: 'module-1', number: 6,
        title: 'Les differentes sessions de trading',
        description: 'Londres, New York, Tokyo. Quand trader et pourquoi chaque session a ses particularites.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/ac91d7b71d1cebcd25/88a050fb2df6f20b',
        document: 'Sessions.png',
      },
      {
        id: 'm1-07', moduleId: 'module-1', number: 7,
        title: "Les differents types d'ordres",
        description: 'Market, limit, stop loss, take profit. Les ordres que tu vas utiliser au quotidien.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/4491d7b71d1ceac4cd/77e2e5142fc159e2',
        document: "Types d ordres.png",
      },
      {
        id: 'm1-08', moduleId: 'module-1', number: 8,
        title: "Creation d'un compte demo",
        description: 'Zero risque. Cree ton compte demo pour pratiquer gratuitement avant de passer en reel.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/ea91d7b71d1fe2c163/e66b3d16491730d3',
        document: null,
      },
      {
        id: 'm1-09', moduleId: 'module-1', number: 9,
        title: 'Tuto MetaTrader 5',
        description: 'Installation et prise en main de MT5, la plateforme de trading professionnelle.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/d391d7b71d1fe4c25a/4c133a2e329d397a',
        document: null,
      },
      {
        id: 'm1-10', moduleId: 'module-1', number: 10,
        title: 'Tuto TradingView',
        description: "TradingView pour l'analyse technique : graphiques, indicateurs, alertes. L'outil indispensable.",
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/7991d7b71b1ae4c3f0/2b21376f64644824',
        document: null,
      },
      {
        id: 'm1-11', moduleId: 'module-1', number: 11,
        title: 'Calculer son risque & Bid/Ask',
        description: 'La gestion du risque separe les gagnants des perdants. Apprends a calculer ton risque correctement.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/0691d7b71b1aeace8f/df1e0b2db3b250d5',
        document: null,
      },
      {
        id: 'm1-12', moduleId: 'module-1', number: 12,
        title: 'Concept VS Analyse',
        description: 'La difference entre concept et analyse technique. Comment passer au niveau superieur.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/ac91d7b71b19e0c525/01eefe69a779db21',
        document: null,
      },
      {
        id: 'm1-13', moduleId: 'module-1', number: 13,
        title: 'Devenir membre PREMIUM',
        description: 'Tu as termine Les Bases ! Passe au niveau superieur avec la formation High Value Concept.',
        type: 'text',
        videoUrl: null,
        document: null,
      },
    ],
  },
  {
    id: 'module-2',
    title: 'High Value Concept',
    description: "La methodologie HVC : liquidite, order flow, ARD, backtesting. Le coeur de notre approche.",
    quizThreshold: 75,
    rewardRole: '1472515219896144038', // @Elite
    rewardRoleName: 'Elite',
    lessons: [
      {
        id: 'm2-01', moduleId: 'module-2', number: 1,
        title: 'Les bases (intro)',
        description: "Introduction au cours High Value Concept. Si tu n'as pas fait Les Bases, commence par la.",
        type: 'text',
        videoUrl: null,
        document: null,
      },
      {
        id: 'm2-02', moduleId: 'module-2', number: 2,
        title: 'Anatomie',
        description: 'Anatomie de la structure du marche. Comment lire les mouvements de prix.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/ea90d6b21d18e6c763/5afaa9a4cf3e4dca',
        document: null,
      },
      {
        id: 'm2-03', moduleId: 'module-2', number: 3,
        title: 'La Nature Fractale',
        description: 'Le marche se repete a toutes les echelles. Comprends la fractalite.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/1190d6b21c1ae1cc98/7b60dfe454247339',
        document: null,
      },
      {
        id: 'm2-04', moduleId: 'module-2', number: 4,
        title: 'Multi-timeframe',
        description: 'Analyser plusieurs timeframes pour confirmer tes setups.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/d390d6b21c1ae0c75a/33538e5e576c7b1f',
        document: null,
      },
      {
        id: 'm2-05', moduleId: 'module-2', number: 5,
        title: 'Realite',
        description: 'La realite du trading : attentes vs resultats.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/ea90d6b21c1ae1c363/37b3f6b197287f06',
        document: null,
      },
      {
        id: 'm2-06', moduleId: 'module-2', number: 6,
        title: 'Liquidite : Definition',
        description: "Le concept central du trading. Comprends ou se trouve l'argent.",
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/4d90d6b41913eac1c4/de4d48b4d5cad5f4',
        document: null,
      },
      {
        id: 'm2-07', moduleId: 'module-2', number: 7,
        title: 'Liquidite : Approfondissement',
        description: 'Approfondis ta comprehension de la liquidite avec des exemples concrets.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/ea90d6b4191ce3c463/6d52fc6a98289156',
        document: null,
      },
      {
        id: 'm2-08', moduleId: 'module-2', number: 8,
        title: 'Liquidite Interne & Externe',
        description: 'La difference entre liquidite interne et externe.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/ac90d6b21c1ae5c125/5bc5c82ede66d707',
        document: null,
      },
      {
        id: 'm2-09', moduleId: 'module-2', number: 9,
        title: 'Variation du prix et Desequilibre',
        description: 'Comment le prix varie et ce que signifient les desequilibres.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/a790d6b21c1ae5c62e/549757b1f669c42d',
        document: null,
      },
      {
        id: 'm2-10', moduleId: 'module-2', number: 10,
        title: 'Modeles ARD et Zones de Recharges',
        description: 'Les modeles ARD et comment identifier les zones de recharges.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/4490d6b21c1ae5c9cd/60113dfc4e56919f',
        document: null,
      },
      {
        id: 'm2-11', moduleId: 'module-2', number: 11,
        title: 'Modeles ARD Graphique',
        description: 'Application graphique des modeles ARD sur les charts.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/ac90d6b21c1ae4c025/12b7b89592ba2412',
        document: null,
      },
      {
        id: 'm2-12', moduleId: 'module-2', number: 12,
        title: 'Order Flow : Definition',
        description: 'Comment les institutions placent leurs ordres sur le marche.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/ac90d6b21c11efc025/7ee618fb8d607138',
        document: null,
      },
      {
        id: 'm2-13', moduleId: 'module-2', number: 13,
        title: 'Order Flow : Exemple',
        description: "Exemple concret d'order flow sur les charts.",
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/4490d6b21c1ae4c8cd/a1c6ee027ed27ca8',
        document: null,
      },
      {
        id: 'm2-14', moduleId: 'module-2', number: 14,
        title: 'Day Trading',
        description: 'Comment structurer ta journee de trading pour maximiser tes resultats.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/ea90dbba1414e1c063/343f5d2b7750b039',
        document: null,
      },
      {
        id: 'm2-15', moduleId: 'module-2', number: 15,
        title: 'Methodologie',
        description: 'La methodologie HVC complete. Comment appliquer tous les concepts.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/ea90dbba1414e1c063/343f5d2b7750b039',
        document: null,
      },
      {
        id: 'm2-16', moduleId: 'module-2', number: 16,
        title: 'Backtesting',
        description: 'Comment backtester ta strategie pour valider ton edge.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/ea90d6b21c1de4c163/4924ec72bf1491f3',
        document: null,
      },
      {
        id: 'm2-17', moduleId: 'module-2', number: 17,
        title: 'Backtesting 2.0',
        description: 'Backtesting avance. Affine ta methodologie avec plus de precision.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/a790d6b21c1de2c62e/73f474746f26eb31',
        document: null,
      },
      {
        id: 'm2-18', moduleId: 'module-2', number: 18,
        title: 'Etude de Cas',
        description: 'Analyse detaillee de trades reels. Application de tous les concepts.',
        type: 'text',
        videoUrl: null,
        document: null,
      },
      {
        id: 'm2-19', moduleId: 'module-2', number: 19,
        title: "Interpretation Order Flow",
        description: "Comment interpreter l'order flow en temps reel.",
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/7990dab5151ae4c3f0/141d8bc96e023e86',
        document: null,
      },
      {
        id: 'm2-20', moduleId: 'module-2', number: 20,
        title: 'Hack Psychologique',
        description: 'Les hacks psychologiques pour rester discipline et rentable.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/0690dab51519e1c68f/0eb9d663cde7a823',
        document: null,
      },
      {
        id: 'm2-21', moduleId: 'module-2', number: 21,
        title: 'Trader 1 Seule Paire',
        description: 'Pourquoi se specialiser sur une paire est la meilleure strategie.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/ea91dbb91b1ae6c463/7595406369b261c2',
        document: null,
      },
    ],
  },
  {
    id: 'module-3',
    title: 'G-Mindset',
    description: 'La psychologie du trader : discipline, emotions, obstacles, journal de trading.',
    quizThreshold: 80,
    rewardRole: '1475360695850762250', // @HVC Graduate
    rewardRoleName: 'HVC Graduate',
    lessons: [
      {
        id: 'm3-01', moduleId: 'module-3', number: 1,
        title: 'Introduction',
        description: 'Pourquoi la psychologie est la cle du succes en trading.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/a790dbb41117ebc32e/a4486d1524588e5b',
        document: null,
      },
      {
        id: 'm3-02', moduleId: 'module-3', number: 2,
        title: 'La metaphore du bamboo',
        description: 'Le bamboo met 5 ans a pousser sous terre avant d exploser. Comme ton parcours en trading.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/ea90dbb41117eac363/4e67597232366401',
        document: null,
      },
      {
        id: 'm3-03', moduleId: 'module-3', number: 3,
        title: 'Comprendre ses emotions',
        description: "La peur, la cupidite, l'euphorie. Comment les reconnaitre et les gerer.",
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/1190dbb41118e0c998/b13af81c4fc6fb18',
        document: null,
      },
      {
        id: 'm3-04', moduleId: 'module-3', number: 4,
        title: 'Cultiver la discipline',
        description: 'La discipline est le muscle le plus important du trader.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/1190dbb41118e2cb98/6ec56c63cf2d47d3',
        document: null,
      },
      {
        id: 'm3-05', moduleId: 'module-3', number: 5,
        title: 'Se detacher des pertes',
        description: 'Les pertes font partie du jeu. Apprends a les accepter sans emotion.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/ac90dbb41117e8c725/0f82c23bb77c0978',
        document: null,
      },
      {
        id: 'm3-06', moduleId: 'module-3', number: 6,
        title: 'Les 5 obstacles',
        description: 'Les 5 obstacles psychologiques qui peuvent detruire ta carriere de trader.',
        type: 'video',
        videoUrl: 'https://videos.sproutvideo.com/embed/7090dbb41118ecc8f9/38e9b9ade16860c8',
        document: null,
      },
      {
        id: 'm3-07', moduleId: 'module-3', number: 7,
        title: 'Reprogrammer la peur',
        description: "Comment transformer la peur d'avoir tort en force.",
        type: 'text',
        videoUrl: null,
        document: null,
      },
      {
        id: 'm3-08', moduleId: 'module-3', number: 8,
        title: 'Journal de Trading',
        description: "Le journal de trading est l'outil numero 1 pour progresser.",
        type: 'text',
        videoUrl: null,
        document: null,
      },
    ],
  },
]

// Helper functions
export function getModule(moduleId: string): Module | undefined {
  return MODULES.find(m => m.id === moduleId)
}

export function getLesson(lessonId: string): Lesson | undefined {
  for (const mod of MODULES) {
    const lesson = mod.lessons.find(l => l.id === lessonId)
    if (lesson) return lesson
  }
  return undefined
}

export function getModuleForLesson(lessonId: string): Module | undefined {
  return MODULES.find(m => m.lessons.some(l => l.id === lessonId))
}

export function getAdjacentLessons(lessonId: string): { prev: Lesson | null; next: Lesson | null } {
  // Flatten all lessons in order
  const allLessons = MODULES.flatMap(m => m.lessons)
  const idx = allLessons.findIndex(l => l.id === lessonId)
  return {
    prev: idx > 0 ? allLessons[idx - 1] : null,
    next: idx < allLessons.length - 1 ? allLessons[idx + 1] : null,
  }
}

export const TOTAL_LESSONS = MODULES.reduce((acc, m) => acc + m.lessons.length, 0)
