export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number // Server-only, stripped before sending to client
}

export interface Quiz {
  moduleId: string
  questions: QuizQuestion[]
}

export const QUIZZES: Quiz[] = [
  {
    moduleId: 'module-1',
    questions: [
      {
        id: 'q1-1',
        question: 'Quel est le volume quotidien moyen echange sur le marche du Forex ?',
        options: ['1.2 trillion $', '3.5 trillions $', '6.6 trillions $', '10 trillions $'],
        correctIndex: 2,
      },
      {
        id: 'q1-2',
        question: "Qu'est-ce qu'un pip ?",
        options: [
          "Le profit d'une position",
          'La plus petite variation de prix (0.0001)',
          'Le spread entre bid et ask',
          "Un type d'ordre",
        ],
        correctIndex: 1,
      },
      {
        id: 'q1-3',
        question: 'Quelle session de trading a le plus de volume ?',
        options: ['Tokyo', 'Sydney', 'Londres', 'New York'],
        correctIndex: 2,
      },
      {
        id: 'q1-4',
        question: "Qu'est-ce qu'un ordre Stop Loss ?",
        options: [
          "Un ordre pour entrer en position",
          "Un ordre qui limite les pertes",
          "Un ordre pour prendre ses profits",
          "Un indicateur technique",
        ],
        correctIndex: 1,
      },
      {
        id: 'q1-5',
        question: 'Que sont les paires de devises majeures ?',
        options: [
          'Les paires les plus risquees',
          'Les paires contenant le USD',
          'Les paires exotiques',
          'Les paires a faible spread',
        ],
        correctIndex: 1,
      },
      {
        id: 'q1-6',
        question: "Qu'est-ce que le leverage (effet de levier) ?",
        options: [
          "Le profit d'un trade",
          "La capacite a controller une position plus grande que son capital",
          "Le spread d'une paire",
          "Le volume d'un trade",
        ],
        correctIndex: 1,
      },
      {
        id: 'q1-7',
        question: 'Quelle est la difference entre un concept et une analyse ?',
        options: [
          "Il n'y a pas de difference",
          "Le concept est la theorie, l'analyse est l'application au graphique",
          "L'analyse est plus importante que le concept",
          "Le concept est un indicateur",
        ],
        correctIndex: 1,
      },
      {
        id: 'q1-8',
        question: "Pourquoi commencer avec un compte demo ?",
        options: [
          'Pour gagner de l argent rapidement',
          'Parce que le broker l exige',
          'Pour pratiquer sans risquer son capital',
          'Pour avoir acces a plus de paires',
        ],
        correctIndex: 2,
      },
      {
        id: 'q1-9',
        question: "Qu'est-ce que le spread ?",
        options: [
          'Le profit potentiel',
          'La difference entre le prix d achat et de vente',
          'Le stop loss optimal',
          'La marge requise',
        ],
        correctIndex: 1,
      },
      {
        id: 'q1-10',
        question: "Quel outil est recommande pour l'analyse technique ?",
        options: ['Excel', 'TradingView', 'Photoshop', 'Discord'],
        correctIndex: 1,
      },
    ],
  },
  {
    moduleId: 'module-2',
    questions: [
      {
        id: 'q2-1',
        question: "Que signifie ARD dans la methodologie HVC ?",
        options: [
          'Analyse, Risque, Decision',
          'Accumulation, Recharge, Distribution',
          'Action, Reaction, Direction',
          'Average, Range, Divergence',
        ],
        correctIndex: 1,
      },
      {
        id: 'q2-2',
        question: "Qu'est-ce que la liquidite en trading ?",
        options: [
          "Le volume d'echanges",
          "L'argent disponible dans le marche ou les ordres en attente sont concentres",
          "Le spread d'une paire",
          "Le leverage du broker",
        ],
        correctIndex: 1,
      },
      {
        id: 'q2-3',
        question: "Quelle est la difference entre liquidite interne et externe ?",
        options: [
          "Il n'y a pas de difference",
          "Interne = Fair Value Gaps, Externe = Highs/Lows",
          "Interne = volume, Externe = prix",
          "Interne = broker, Externe = marche",
        ],
        correctIndex: 1,
      },
      {
        id: 'q2-4',
        question: "Qu'est-ce que la nature fractale du marche ?",
        options: [
          'Le marche est aleatoire',
          'Les memes structures se repetent a toutes les echelles de temps',
          'Le marche suit une direction lineaire',
          'La fractale est un indicateur technique',
        ],
        correctIndex: 1,
      },
      {
        id: 'q2-5',
        question: "Pourquoi utiliser l'analyse multi-timeframe ?",
        options: [
          'Pour trouver plus de trades',
          'Pour confirmer les setups en alignant plusieurs echelles de temps',
          'Parce que c est obligatoire',
          'Pour trader plus vite',
        ],
        correctIndex: 1,
      },
      {
        id: 'q2-6',
        question: "Qu'est-ce que l'Order Flow ?",
        options: [
          "Un indicateur MT5",
          "Le flux des ordres institutionnels sur le marche",
          "Un type de graphique",
          "Le spread moyen",
        ],
        correctIndex: 1,
      },
      {
        id: 'q2-7',
        question: "Quel est l'objectif du backtesting ?",
        options: [
          'Trader en temps reel',
          'Valider une strategie sur des donnees historiques avant de l appliquer en live',
          'Copier les trades des autres',
          'Trouver le meilleur indicateur',
        ],
        correctIndex: 1,
      },
      {
        id: 'q2-8',
        question: "Qu'est-ce qu'une zone de recharge ?",
        options: [
          'Une pause dans le trading',
          'Une zone ou le prix revient chercher de la liquidite avant de continuer',
          'Un indicateur de volume',
          'Le point d entree optimal',
        ],
        correctIndex: 1,
      },
      {
        id: 'q2-9',
        question: 'Pourquoi se specialiser sur une seule paire ?',
        options: [
          'Pour diversifier ses risques',
          'Parce que les brokers l exigent',
          'Pour maitriser le comportement specifique de cette paire',
          'Pour avoir plus de leverage',
        ],
        correctIndex: 2,
      },
      {
        id: 'q2-10',
        question: "Comment structurer une journee de Day Trading ?",
        options: [
          'Trader 24h/24',
          'Se concentrer sur les sessions actives et suivre un plan precis',
          'Trader uniquement pendant la session de Tokyo',
          'Attendre les annonces economiques',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    moduleId: 'module-3',
    questions: [
      {
        id: 'q3-1',
        question: 'Que represente la metaphore du bamboo en trading ?',
        options: [
          'Le marche est vert comme le bamboo',
          'La croissance est invisible pendant longtemps avant d exploser',
          'Il faut planter beaucoup de trades',
          'Le bamboo est le symbole du Forex',
        ],
        correctIndex: 1,
      },
      {
        id: 'q3-2',
        question: "Quelles sont les emotions principales a gerer en trading ?",
        options: [
          'La joie et la tristesse',
          'La peur, la cupidite et l euphorie',
          'La colere et la fatigue',
          'L ennui et l impatience',
        ],
        correctIndex: 1,
      },
      {
        id: 'q3-3',
        question: 'Pourquoi la discipline est-elle essentielle ?',
        options: [
          'Pour trader plus souvent',
          'Pour suivre son plan sans devier malgre les emotions',
          'Pour impressionner les autres traders',
          'La discipline n est pas importante',
        ],
        correctIndex: 1,
      },
      {
        id: 'q3-4',
        question: 'Comment se detacher des pertes ?',
        options: [
          'Ne jamais perdre',
          'Accepter que les pertes font partie du processus et se concentrer sur l edge statistique',
          'Augmenter la taille des positions pour recuperer',
          'Changer de strategie a chaque perte',
        ],
        correctIndex: 1,
      },
      {
        id: 'q3-5',
        question: "Quel est l'outil numero 1 pour progresser en trading ?",
        options: [
          'Un indicateur magique',
          'Le journal de trading',
          'Un groupe Telegram de signaux',
          'Un robot de trading',
        ],
        correctIndex: 1,
      },
      {
        id: 'q3-6',
        question: 'Quel est l un des 5 obstacles psychologiques en trading ?',
        options: [
          'Avoir trop de capital',
          'La peur de manquer une opportunite (FOMO)',
          'Trader trop peu',
          'Utiliser TradingView',
        ],
        correctIndex: 1,
      },
      {
        id: 'q3-7',
        question: 'Comment reprogrammer la peur en trading ?',
        options: [
          'Ignorer ses emotions',
          'Accepter l incertitude et se concentrer sur le processus plutot que le resultat',
          'Augmenter le leverage',
          'Ne trader que les paires exotiques',
        ],
        correctIndex: 1,
      },
      {
        id: 'q3-8',
        question: 'Que doit contenir un bon journal de trading ?',
        options: [
          'Uniquement les trades gagnants',
          'Les entrees, sorties, emotions, captures d ecran, et lecons de chaque trade',
          'Le solde du compte',
          'Les predictions du marche',
        ],
        correctIndex: 1,
      },
      {
        id: 'q3-9',
        question: 'Pourquoi la psychologie est-elle plus importante que la strategie ?',
        options: [
          'La strategie ne sert a rien',
          'Meme la meilleure strategie echoue si le trader ne gere pas ses emotions',
          'La psychologie n est pas importante',
          'On peut copier la strategie des autres',
        ],
        correctIndex: 1,
      },
      {
        id: 'q3-10',
        question: "Quel mindset adopter face a une serie de pertes ?",
        options: [
          'Revenge trading pour recuperer',
          'Analyser, s adapter, et faire confiance a son edge sur le long terme',
          'Abandonner le trading',
          'Doubler ses positions',
        ],
        correctIndex: 1,
      },
    ],
  },
]

// Get quiz for a module (strips correct answers for client)
export function getQuizForClient(moduleId: string) {
  const quiz = QUIZZES.find(q => q.moduleId === moduleId)
  if (!quiz) return null

  return {
    moduleId: quiz.moduleId,
    questions: quiz.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
    })),
  }
}

// Server-side: validate answers
export function gradeQuiz(moduleId: string, answers: Record<string, number>): { score: number; total: number; passed: boolean } {
  const quiz = QUIZZES.find(q => q.moduleId === moduleId)
  if (!quiz) return { score: 0, total: 0, passed: false }

  const module = { 'module-1': 70, 'module-2': 75, 'module-3': 80 }
  const threshold = module[moduleId as keyof typeof module] || 70

  let correct = 0
  for (const q of quiz.questions) {
    if (answers[q.id] === q.correctIndex) correct++
  }

  const score = Math.round((correct / quiz.questions.length) * 100)
  return { score, total: quiz.questions.length, passed: score >= threshold }
}
