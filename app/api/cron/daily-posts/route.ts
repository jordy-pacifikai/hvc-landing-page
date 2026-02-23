import { NextRequest, NextResponse } from 'next/server'

const DATASET_WEBHOOK = 'https://discord.com/api/webhooks/1475070218974793760/ON6KHL5q1vXgeRXhkHMCFEFV2uuenh1GCiV14z4X1hlvqiVEKIxDpd5mvxSVcKAiJ1jo'
const MOTIVATION_WEBHOOK = 'https://discord.com/api/webhooks/1475070237119348860/UMXORd1CeZwLPpwSxAVu4cKvbYDRNxi4PnDE3hg7u_bxbL-OkEQfVog55_G7jo1NaNeK'
const GIVEAWAY_WEBHOOK = 'https://discord.com/api/webhooks/1475079705983189165/fpO-432l_iXVXCRklE0JEcF_1ZWia1fw2zErzCMNF-whlXNmgkuNDXHdc4DZNBkIOurQ'
const CRON_SECRET = process.env.CRON_SECRET

// --- Helpers ---

function getDayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now.getTime() - start.getTime()) / 86400000)
}

function getTahitiHour(): number {
  return parseInt(
    new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: 'Pacific/Tahiti' })
  )
}

// --- DATASET: Leçons psychologie & discipline trading ---
// Format Heartbeat: H2 titre percutant → explication → 📌 rappel → ✅ action → CTA

const DATASET_LESSONS = [
  {
    title: "Le marché est neutre, c'est toi qui réagis mal.",
    body: "Le marché ne te cible pas, ne te punit pas. Il fait ce qu'il fait. C'est ton interprétation émotionnelle qui transforme un mouvement de prix en frustration ou en panique.",
    reminder: "le marché ne vous punit pas. Il vous teste.",
    action: "Reste lucide. Réagis avec méthode, pas avec émotion.",
  },
  {
    title: "Les dégâts viennent toujours après le choc.",
    body: "Une perte fait mal. Mais ce qui détruit un compte, c'est rarement la perte initiale — c'est le revenge trading qui suit. L'envie de se refaire immédiatement court-circuite toute logique.",
    reminder: "ce n'est pas la perte qui te ruine, c'est le comportement qui suit.",
    action: "Reviens au calme. Laisse le plan te guider, pas ton ego.",
  },
  {
    title: "Ne pas savoir s'arrêter, c'est perdre après avoir gagné.",
    body: "Tu as fait 3 bons trades, tu es en confiance. Puis tu en prends un 4ème, un 5ème… et tu rends tout. La discipline de sortie est aussi importante que la discipline d'entrée.",
    reminder: "un bon trader sait quand entrer… mais surtout quand sortir du marché.",
    action: "Fixe-toi une limite claire. Et respecte-la.",
  },
  {
    title: "Ce que tu laisses passer t'éloigne de ta rigueur.",
    body: "Chaque petit écart — un SL bougé, un trade sans setup, un risque doublé — fragilise ta discipline. Pas aujourd'hui. Pas cette fois. Ces exceptions deviennent vite la norme.",
    reminder: "chaque petit écart fragilise votre discipline.",
    action: "Sois strict. Ce que tu répètes devient ton niveau.",
  },
  {
    title: "L'ego est l'ennemi du bon trader.",
    body: "Vouloir avoir raison coûte cher. Le marché se fiche de ton analyse, de tes certitudes, de ton opinion. Les meilleurs traders acceptent d'avoir tort rapidement et passent au suivant.",
    reminder: "vouloir avoir raison détruit plus de comptes que le marché lui-même.",
    action: "Accepte d'avoir tort rapidement. Cut the loss, move on.",
  },
  {
    title: "Trop d'outils, c'est trop de bruit.",
    body: "Trois indicateurs qui se contredisent ne valent pas un seul signal clair. La clarté du graphique reflète la clarté de ta pensée. Simplifie.",
    reminder: "ce n'est pas en ajoutant des couches que vous gagnez, c'est en clarifiant votre lecture.",
    action: "Allège ton graphique. Maîtrise 2-3 outils à fond plutôt que 10 en surface.",
  },
  {
    title: "Chercher la certitude te rend moins performant.",
    body: "Le trading est un jeu de probabilités, pas de certitudes. Attendre LE signal parfait, c'est manquer 90% des opportunités. Tu n'es pas payé pour prédire — tu es payé pour gérer l'incertitude.",
    reminder: "vous êtes payé pour gérer l'incertitude, pas pour l'éliminer.",
    action: "Concentre-toi sur ta réponse au marché, pas sur ta prédiction.",
  },
  {
    title: "L'inconfort est le terrain où la discipline se construit.",
    body: "Respecter son SL quand on a envie de le bouger. Ne pas entrer quand le FOMO pousse. Fermer la plateforme après 2 pertes. C'est dans ces moments que la vraie discipline se forge.",
    reminder: "chaque fois que vous évitez l'inconfort, vous évitez le progrès.",
    action: "Apprends à être stable dans l'instabilité. C'est là que se fait la différence.",
  },
  {
    title: "L'honnêteté personnelle est la base de toute évolution.",
    body: "Si tu ne sais pas pourquoi tu perds, c'est que tu ne regardes pas assez honnêtement tes trades. Le journal de trading ne ment pas — mais encore faut-il le remplir vraiment.",
    reminder: "le progrès commence le jour où vous arrêtez de vous mentir.",
    action: "Assume chaque erreur. Note-la. Apprends d'elle. C'est le seul chemin.",
  },
  {
    title: "L'impatience ruine les comptes, pas les setups.",
    body: "Tu vois un mouvement, tu veux être dedans MAINTENANT. Mais le setup n'est pas là. Tu entres quand même. Résultat : un trade émotionnel, un SL touché, une frustration de plus.",
    reminder: "ce n'est pas le marché qui est lent, c'est vous qui êtes trop pressé.",
    action: "Ralentis. N'agis que quand ton plan est en place.",
  },
  {
    title: "La constance bat le talent sur le long terme.",
    body: "Un trader moyen avec une discipline de fer battra toujours un trader talentueux qui improvise. Le marché récompense la régularité, pas les coups d'éclat.",
    reminder: "la régularité est la compétence la plus sous-estimée en trading.",
    action: "Trade le même setup, avec le même risque, tous les jours. Laisse le temps faire le reste.",
  },
  {
    title: "Ton capital mental vaut plus que ton capital financier.",
    body: "Tu peux reconstruire un compte. Tu ne peux pas facilement reconstruire ta confiance après une série de trades destructeurs. Protège ton mental comme tu protèges ton solde.",
    reminder: "un trader fatigué mentalement est un trader dangereux pour son propre compte.",
    action: "Si tu n'es pas dans le bon état d'esprit, ne trade pas. Point.",
  },
  {
    title: "Comparer tes résultats aux autres est une impasse.",
    body: "Celui qui montre +500% ne montre pas ses 3 comptes cramés avant. Le trading est un sport individuel. Ton seul benchmark, c'est toi d'il y a 6 mois.",
    reminder: "la comparaison est le voleur de la performance en trading.",
    action: "Mesure tes progrès par rapport à TOI. Pas par rapport aux screenshots des autres.",
  },
  {
    title: "Le drawdown fait partie du jeu.",
    body: "Même les meilleurs systèmes ont des périodes de perte. La différence entre un trader pro et un amateur, c'est comment il gère le drawdown — pas comment il l'évite.",
    reminder: "le drawdown n'est pas un échec, c'est un coût opérationnel.",
    action: "Accepte les périodes de perte. Reste fidèle au plan. Le rebond viendra.",
  },
  {
    title: "Un bon trade peut perdre de l'argent.",
    body: "Si tu as respecté ton plan, pris le bon setup, géré ton risque — et que le SL est touché — c'est un bon trade. Le résultat d'UN trade ne définit pas sa qualité.",
    reminder: "jugez vos trades par le processus, jamais par le résultat isolé.",
    action: "Évalue tes trades sur 50+ occurrences, pas une par une.",
  },
  {
    title: "Le marché te paie pour attendre.",
    body: "Les meilleures opportunités ne viennent pas toutes les heures. Parfois la meilleure position, c'est pas de position. Les snipers attendent le bon moment.",
    reminder: "la patience n'est pas l'inaction — c'est l'action disciplinée de ne rien faire quand il n'y a rien à faire.",
    action: "Si le setup n'est pas A+, passe. Il y en aura un autre.",
  },
  {
    title: "Les backtests ne te préparent pas à l'émotion du live.",
    body: "En backtest, tu es objectif. En live, ton argent est en jeu, et soudain ton cerveau reptilien prend le contrôle. La transition backtest → live est le vrai défi.",
    reminder: "le fossé entre la théorie et la pratique se comble avec l'exposition, pas avec plus de théorie.",
    action: "Commence petit en live. Laisse ton cerveau s'habituer au risque réel.",
  },
  {
    title: "Risquer plus ne te fera pas rattraper plus vite.",
    body: "Après une série de pertes, doubler la taille ne fait qu'accélérer la destruction. C'est le piège classique : vouloir se refaire en augmentant le levier.",
    reminder: "doubler le risque après une perte, c'est doubler le problème.",
    action: "Après une mauvaise série, RÉDUIS ton risque. Rebuilde la confiance d'abord.",
  },
  {
    title: "Le journaling est ton avantage compétitif.",
    body: "95% des traders ne tiennent pas de journal. Ceux qui le font voient leurs patterns, corrigent leurs erreurs, et progressent 3x plus vite que les autres.",
    reminder: "un journal de trading est ton meilleur mentor. Il ne ment jamais.",
    action: "Note chaque trade : entry, exit, émotion, setup, résultat. Revois tes notes chaque vendredi.",
  },
  {
    title: "La peur de manquer détruit plus que la peur de perdre.",
    body: "Le FOMO te pousse à entrer trop tard, sans plan, sans SL clair. Tu achètes le sommet parce que 'ça monte'. Le FOMO est l'ennemi n°1 du trader particulier.",
    reminder: "si tu as peur de rater un mouvement, c'est que tu n'as pas de plan.",
    action: "Prépare tes niveaux AVANT que le prix y arrive. Le plan tue le FOMO.",
  },
  {
    title: "Gagner en démo ne prouve rien.",
    body: "En démo, tu n'as pas la pression du risque réel. Tu prends des décisions parfaites parce que tu n'as rien à perdre. Le vrai trading commence quand c'est ton argent.",
    reminder: "la démo apprend la technique. Le live apprend la psychologie.",
    action: "Passe en live avec un micro-compte dès que la technique est solide. L'émotion s'apprend en situation.",
  },
  {
    title: "Chaque session de trading mérite une préparation.",
    body: "Tu ne montes pas sur un ring sans t'échauffer. Tu ne devrais pas ouvrir MT5 sans avoir fait ton analyse, identifié tes niveaux, et défini tes scénarios.",
    reminder: "la préparation élimine 80% des erreurs émotionnelles.",
    action: "15 minutes de préparation avant chaque session. Niveaux, biais, news, limites.",
  },
  {
    title: "Trader pour l'adrénaline est le chemin le plus court vers la ruine.",
    body: "Si tu trades parce que c'est excitant, tu n'es pas un trader — tu es un joueur. Le trading rentable est ennuyeux, répétitif, et méthodique.",
    reminder: "si trader te donne des frissons, c'est que tu risques trop ou que tu n'as pas de plan.",
    action: "Rends ton trading ennuyeux. Le même setup, le même risque, la même routine.",
  },
  {
    title: "Le break-even est sous-estimé.",
    body: "Un mois à 0% après une série de pertes, c'est une victoire. Ça veut dire que tu as stabilisé. Le break-even construit la base du prochain niveau.",
    reminder: "ne pas perdre est déjà gagner quand tu es en reconstruction.",
    action: "Si tu es en difficulté, vise le break-even. Le profit reviendra naturellement.",
  },
  {
    title: "La routine du matin définit la qualité de tes trades.",
    body: "Comment tu commences ta journée de trading impacte directement tes décisions. Fatigué, stressé, distrait = mauvaises décisions garanties.",
    reminder: "un esprit clair prend de meilleures décisions qu'un esprit encombré.",
    action: "Crée un rituel : café, analyse, journal, niveaux. Puis seulement : plateforme.",
  },
  {
    title: "Accepter de ne pas comprendre un mouvement.",
    body: "Le marché fait parfois des choses inexplicables. Chercher à tout comprendre mène à l'overtrading et à la frustration. Parfois la meilleure analyse c'est : 'je ne sais pas'.",
    reminder: "vous n'avez pas besoin de comprendre chaque mouvement pour être rentable.",
    action: "Si le mouvement ne fait pas sens, reste en dehors. La clarté reviendra.",
  },
  {
    title: "La taille de position est ta première ligne de défense.",
    body: "Avant l'analyse, avant le setup, avant le timing — il y a la taille de position. 1% de risque par trade n'est pas une suggestion, c'est une règle de survie.",
    reminder: "le money management est le seul facteur que vous contrôlez à 100%.",
    action: "Calcule ta taille AVANT de placer le trade. Pas après. Pas 'à peu près'.",
  },
  {
    title: "Le perfectionnisme est un piège déguisé en vertu.",
    body: "Attendre le trade parfait, la stratégie parfaite, le moment parfait — c'est de la procrastination habillée en prudence. Done is better than perfect.",
    reminder: "une stratégie imparfaite appliquée avec discipline bat une stratégie parfaite jamais exécutée.",
    action: "Lance-toi avec ce que tu as. Ajuste en route. La perfection viendra avec l'expérience.",
  },
  {
    title: "Les weekends sont faits pour analyser, pas pour regretter.",
    body: "Utilise le weekend pour revoir ta semaine : qu'est-ce qui a marché ? Qu'est-ce que tu aurais fait différemment ? Le weekend est ton moment de recul stratégique.",
    reminder: "un trader qui ne fait pas de bilan hebdomadaire répète les mêmes erreurs en boucle.",
    action: "Chaque dimanche : revue des trades, mise à jour du journal, préparation de la semaine.",
  },
  {
    title: "La qualité de tes questions détermine la qualité de tes résultats.",
    body: "'Combien je peux gagner ?' est la mauvaise question. 'Combien je peux perdre ?' est la bonne. Les bons traders posent les bonnes questions.",
    reminder: "la question n'est jamais 'combien je gagne' mais 'combien je risque'.",
    action: "Avant chaque trade, demande-toi : 'Quel est mon pire scénario ?' Si tu ne peux pas l'accepter, ne trade pas.",
  },
]

// --- MOTIVATION: Citations courtes percutantes ---
// Format Heartbeat: titre fort + contexte court + appel à l'échange

const MOTIVATION_POSTS = [
  {
    title: "La discipline est un muscle, pas un talent.",
    body: "Plus tu la pratiques, plus elle devient naturelle. Personne ne naît discipliné. C'est un choix quotidien, trade après trade.",
    cta: "Et toi, quel est le domaine où ta discipline a le plus progressé ?",
  },
  {
    title: "Ce n'est pas le marché qui décide de ta réussite — c'est toi.",
    body: "Le marché offre les mêmes opportunités à tout le monde. La différence, c'est ce que TU en fais. Ton plan, ta rigueur, ta constance.",
    cta: "Quel a été ton meilleur trade cette semaine ? Partage ton analyse.",
  },
  {
    title: "La patience est la compétence la mieux rémunérée en trading.",
    body: "Attendre le bon setup, c'est déjà trader. Les meilleurs snipers du marché passent 80% de leur temps à ne rien faire.",
    cta: "As-tu réussi à laisser passer un mauvais trade cette semaine ?",
  },
  {
    title: "Chaque erreur est une leçon — si tu la notes.",
    body: "Un trade perdant sans journaling, c'est une erreur gaspillée. Un trade perdant documenté, c'est un investissement dans ta progression.",
    cta: "Quelle a été ta plus grande leçon cette semaine ?",
  },
  {
    title: "Le processus > le résultat.",
    body: "Concentre-toi sur l'exécution parfaite de ton plan. Les résultats suivront. Ceux qui cherchent les profits en premier les trouvent en dernier.",
    cta: "Qu'est-ce que tu fais pour améliorer ton processus chaque semaine ?",
  },
  {
    title: "La régularité bat les coups d'éclat.",
    body: "1% par semaine = +68% par an. Pas besoin de home runs. Juste de la constance, de la rigueur, et de la patience.",
    cta: "Quel est ton objectif mensuel réaliste ?",
  },
  {
    title: "Un bon trader sait dire non.",
    body: "Non au FOMO. Non au revenge trading. Non au trade de l'ennui. Les meilleurs traders sont des experts du refus.",
    cta: "À quoi as-tu dit non récemment ?",
  },
  {
    title: "Ton avenir en trading se construit aujourd'hui.",
    body: "Chaque session bien préparée, chaque trade bien exécuté, chaque journal bien rempli — c'est un pas de plus vers la rentabilité.",
    cta: "Qu'as-tu fait aujourd'hui pour être un meilleur trader demain ?",
  },
  {
    title: "Le marché ne te doit rien. C'est à toi de mériter tes gains.",
    body: "Pas de raccourci, pas de formule magique. Juste du travail, de la discipline, et du temps. Ceux qui cherchent la facilité trouvent la déception.",
    cta: "Quel effort as-tu fait cette semaine pour progresser ?",
  },
  {
    title: "La communauté est un accélérateur.",
    body: "Seul on va vite, ensemble on va loin. Échanger avec d'autres traders sérieux, c'est se donner les moyens de voir ses angles morts.",
    cta: "Qu'as-tu appris d'un autre membre de la communauté récemment ?",
  },
  {
    title: "N'attends pas d'être prêt — commence et ajuste.",
    body: "Il n'y a pas de moment parfait pour commencer. Les meilleurs ont commencé avant d'être prêts et ont appris en route.",
    cta: "Quelle action concrète vas-tu prendre cette semaine ?",
  },
  {
    title: "La persévérance distingue ceux qui réussissent de ceux qui abandonnent.",
    body: "Tous les traders rentables ont traversé des phases difficiles. La différence : ils n'ont pas lâché. Ils ont ajusté, appris, et continué.",
    cta: "Raconte un moment où tu as failli abandonner mais tu as tenu bon.",
  },
  {
    title: "Ton pire ennemi en trading te regarde dans le miroir.",
    body: "Ce n'est ni le broker, ni le marché, ni la stratégie. C'est toi — tes émotions, tes raccourcis, tes excuses. Maîtrise-toi et tu maîtriseras le marché.",
    cta: "Quel aspect de ta psychologie travailles-tu en ce moment ?",
  },
  {
    title: "Le plan de trading est ton ancre dans la tempête.",
    body: "Quand le marché s'agite, quand les émotions montent, ton plan est là pour te rappeler quoi faire. Sans plan, tu navigues à vue.",
    cta: "Tu as un plan de trading écrit ? Partage-le ou pose tes questions.",
  },
  {
    title: "Les petites victoires construisent les grandes réussites.",
    body: "Un SL respecté, un journal tenu, un trade bien préparé — chaque petite victoire renforce ta confiance et ta discipline.",
    cta: "Quelle petite victoire as-tu obtenue récemment ?",
  },
  {
    title: "Le trading est un marathon, pas un sprint.",
    body: "Ceux qui durent sont ceux qui protègent leur capital — financier ET mental. Pas de rush, pas de pression. Step by step.",
    cta: "Qu'est-ce que tu fais pour protéger ton capital mental ?",
  },
  {
    title: "La gratitude est un état d'esprit qui change tout.",
    body: "Être reconnaissant d'avoir l'opportunité de trader, de pouvoir apprendre, de faire partie d'une communauté. Ça change la perspective.",
    cta: "Pour quoi es-tu reconnaissant dans ton parcours trading ?",
  },
  {
    title: "Investis dans toi-même, c'est le meilleur ROI.",
    body: "Formations, livres, mentors, pratique. Chaque franc investi dans ta compétence te rapportera 100x plus que n'importe quel trade.",
    cta: "Quel livre ou ressource t'a le plus aidé dans ton trading ?",
  },
  {
    title: "Lundi est une nouvelle semaine, une nouvelle opportunité.",
    body: "Peu importe comment la semaine dernière s'est passée. Aujourd'hui tu recommences. Avec les leçons d'hier et l'énergie de demain.",
    cta: "Quel est ton objectif n°1 pour cette semaine ?",
  },
  {
    title: "Le respect du stop-loss est la marque du professionnel.",
    body: "Un amateur bouge son SL. Un pro l'accepte et passe au trade suivant. La douleur d'un SL touché est temporaire. La douleur d'un compte cramé est durable.",
    cta: "As-tu déjà bougé un SL et regretté ? Partage ton expérience.",
  },
  {
    title: "Entoure-toi de personnes qui visent plus haut.",
    body: "Ton niveau est la moyenne des 5 personnes avec qui tu passes le plus de temps. Choisis des partenaires de route ambitieux et disciplinés.",
    cta: "Qui t'inspire dans ton parcours trading ?",
  },
  {
    title: "La clé n'est pas de gagner chaque trade — c'est de gagner sur la durée.",
    body: "Un taux de réussite de 55% avec un bon R:R suffit pour être très rentable. Arrête de chercher le 100% — cherche la constance.",
    cta: "Quel est ton win rate actuel ? Tu le connais ?",
  },
  {
    title: "Ton énergie est limitée — utilise-la intelligemment.",
    body: "Trade les meilleures sessions, analyse les meilleurs setups, et repose-toi le reste du temps. La qualité bat la quantité, toujours.",
    cta: "Quelle est ta session préférée et pourquoi ?",
  },
  {
    title: "Chaque jour est une chance de faire mieux qu'hier.",
    body: "Pas besoin de révolutionner ton trading d'un coup. Juste 1% mieux chaque jour. En un an, tu seras méconnaissable.",
    cta: "Quel petit changement as-tu fait récemment qui a eu un impact ?",
  },
  {
    title: "La simplicité est le summum de la sophistication.",
    body: "Les meilleurs systèmes de trading sont souvent les plus simples. Un setup, des règles claires, une exécution rigoureuse. Pas besoin de plus.",
    cta: "Décris ta stratégie en une phrase. Si tu ne peux pas, elle est peut-être trop complexe.",
  },
  {
    title: "Le succès en trading est silencieux.",
    body: "Pas de Lamborghini, pas de screenshots de P&L. Les vrais traders rentables sont discrets, méthodiques, et constants. Le bruit, c'est pour les vendeurs de rêves.",
    cta: "Qu'est-ce que le succès en trading signifie pour toi personnellement ?",
  },
  {
    title: "Ta confiance vient de ta préparation.",
    body: "Plus tu es préparé, moins tu doutes. Plus tu as backtesté, plus tu fais confiance à ton edge. La confiance n'est pas innée — elle se construit.",
    cta: "Combien de temps passes-tu en préparation vs en trading actif ?",
  },
  {
    title: "Le meilleur investissement ? Ton journal de trading.",
    body: "Gratuit, accessible, et plus puissant que n'importe quel indicateur. Ton journal te montre exactement où tu gagnes et où tu perds.",
    cta: "Quel format utilises-tu pour ton journal ? Partage tes tips.",
  },
  {
    title: "La liberté financière commence par la liberté émotionnelle.",
    body: "Tant que tes émotions dirigent tes trades, l'argent sera instable. Maîtrise tes émotions d'abord — l'argent suivra.",
    cta: "Quelle émotion te pose le plus de problèmes en trading ?",
  },
  {
    title: "Sois le trader que tu voudrais copier.",
    body: "Si quelqu'un regardait tes trades, ta discipline, ton journal — est-ce qu'il voudrait te copier ? Si non, tu sais ce qu'il te reste à faire.",
    cta: "Donne un conseil au 'toi' d'il y a 6 mois.",
  },
]

// --- GIVEAWAY: Concours & tirages au sort ---
// Format Heartbeat: vrais concours avec lots, tirages parmi les actifs, récompenses engagement
// Posté 1x par semaine (le lundi)

const GIVEAWAY_POSTS = [
  {
    title: "1 mois Premium offert",
    description: "On offre **1 mois d'abonnement Premium gratuit** à un membre actif de la communauté cette semaine !",
    howToParticipate: "Sois actif dans les channels cette semaine : poste dans #dataset, #motivation, ou #profit. Chaque message = 1 chance au tirage.",
    prize: "1 mois Premium HVC (valeur 49€) — accès formation complète, analyses live, mentoring",
    draw: "Tirage au sort dimanche soir parmi tous les participants.",
  },
  {
    title: "Session Mentoring 1-on-1",
    description: "Gagne une **session de mentoring privée de 30 minutes** avec un trader expérimenté de l'équipe HVC !",
    howToParticipate: "Partage ton meilleur trade de la semaine dans #profit avec ton analyse complète (entry, SL, TP, R:R, pourquoi ce setup).",
    prize: "1 session mentoring 1-on-1 en visio — analyse de ton trading, feedback personnalisé, axes d'amélioration",
    draw: "Le trade le mieux documenté et analysé sera sélectionné dimanche.",
  },
  {
    title: "Accès Formation Complète",
    description: "Cette semaine, on offre l'**accès complet à un module de la formation Premium** à un membre motivé !",
    howToParticipate: "Dis-nous dans les commentaires quel aspect du trading tu veux le plus améliorer et pourquoi. Sois honnête et détaillé.",
    prize: "Accès à 1 module complet de la formation HVC au choix (psychologie, money management, analyse technique, ou order flow)",
    draw: "La réponse la plus sincère et motivée sera choisie vendredi.",
  },
  {
    title: "Tirage Membre le Plus Actif du Mois",
    description: "Le **membre le plus actif** de la communauté ce mois-ci reçoit un cadeau spécial de l'équipe HVC !",
    howToParticipate: "Participe aux discussions, aide les autres membres, partage tes analyses et tes retours d'expérience. Chaque interaction compte.",
    prize: "2 mois Premium offerts + badge exclusif 'Top Contributeur' sur Discord",
    draw: "Annonce le dernier dimanche du mois basé sur l'activité globale.",
  },
  {
    title: "Challenge P&L de la Semaine",
    description: "Montre tes résultats de la semaine et tente de gagner un **mois Premium offert** !",
    howToParticipate: "Poste ton P&L de la semaine dans #profit (screenshot ou résumé). Pas besoin d'être en positif — on récompense la transparence et la discipline, pas juste les gains.",
    prize: "1 mois Premium HVC offert au participant le plus discipliné (respect du plan, gestion du risque, journaling)",
    draw: "Sélection dimanche soir par l'équipe HVC.",
  },
  {
    title: "Parrainage Récompensé",
    description: "Invite un ami trader dans la communauté et vous gagnez **tous les deux** !",
    howToParticipate: "Partage ton lien d'invitation Discord à un ami intéressé par le trading. Quand il rejoint et se présente dans #bienvenue, vous êtes tous les deux inscrits au tirage.",
    prize: "2 semaines Premium offertes pour le parrain ET le filleul",
    draw: "Tirage chaque dimanche parmi les parrainages de la semaine.",
  },
  {
    title: "Meilleure Analyse Technique",
    description: "Partage ton **analyse technique la plus propre** de la semaine et gagne un accès Premium !",
    howToParticipate: "Poste une analyse technique complète dans #dataset : graphique annoté, niveaux clés, biais, scénario haussier et baissier. Montre ton raisonnement.",
    prize: "1 mois Premium HVC + ton analyse sera partagée comme exemple dans la formation",
    draw: "L'analyse la plus complète et claire sera choisie dimanche.",
  },
  {
    title: "Streak de Discipline",
    description: "Prouve ta **discipline sur 5 jours consécutifs** et gagne un lot !",
    howToParticipate: "Chaque jour de la semaine (lundi au vendredi), poste dans #motivation ta routine de trading du jour : préparation, nombre de trades, respect du plan (oui/non), leçon du jour.",
    prize: "1 mois Premium HVC pour chaque membre qui complète les 5 jours sans interruption",
    draw: "Automatique : tous ceux qui postent 5/5 jours gagnent.",
  },
  {
    title: "Transformation Trading",
    description: "Raconte ton **parcours de progression** en trading et inspire la communauté !",
    howToParticipate: "Partage ton histoire : où tu en étais il y a 6 mois/1 an, les erreurs que tu as faites, ce qui a changé, où tu en es maintenant. La vulnérabilité et l'authenticité sont valorisées.",
    prize: "2 mois Premium HVC + mise en avant de ton témoignage sur nos réseaux sociaux",
    draw: "Le témoignage le plus inspirant sera choisi dimanche.",
  },
  {
    title: "Journal de Trading Challenge",
    description: "Tiens un **journal de trading impeccable** pendant 1 semaine et gagne !",
    howToParticipate: "Poste chaque soir un résumé de tes trades du jour dans #profit : paire, direction, entry, SL, TP, résultat, émotion, leçon. Format libre mais complet.",
    prize: "1 mois Premium HVC + feedback personnalisé sur ton journal par l'équipe",
    draw: "Tous les participants avec 4+ jours documentés sont éligibles. Tirage dimanche.",
  },
  {
    title: "Screenshot Challenge",
    description: "Partage le **screenshot de ton setup le plus propre** de la semaine !",
    howToParticipate: "Poste un screenshot de graphique dans #profit montrant un setup que tu as pris (ou que tu as identifié). Annote-le avec tes niveaux, ton raisonnement, et le résultat.",
    prize: "1 mois Premium HVC pour le setup le mieux présenté",
    draw: "Vote de la communauté + décision finale de l'équipe dimanche.",
  },
  {
    title: "Aide un Membre, Gagne un Lot",
    description: "Cette semaine, on récompense l'**entraide** dans la communauté !",
    howToParticipate: "Aide un autre membre : réponds à une question, donne un conseil constructif, partage une ressource utile. Les membres aidés peuvent nominer leur 'helper' dans les commentaires.",
    prize: "1 mois Premium HVC pour le membre le plus aidant de la semaine",
    draw: "Basé sur les nominations de la communauté. Annonce dimanche.",
  },
]

// --- BUILD MESSAGES ---

function buildDatasetMessage(): { content: string } {
  const dayNum = getDayOfYear()
  const lesson = DATASET_LESSONS[dayNum % DATASET_LESSONS.length]

  const content = `## ${lesson.title}

${lesson.body}

📌 **Rappelez-vous** : ${lesson.reminder}

✅ ${lesson.action}

Partage ta pensée sur ce sujet dans les commentaires. 💬`

  return { content }
}

function buildGiveawayMessage(): { content: string } | null {
  // Only post on Mondays
  const now = new Date()
  const tahitiDayStr = now.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Pacific/Tahiti' })
  if (tahitiDayStr !== 'Monday') return null

  const weekNum = Math.floor(getDayOfYear() / 7)
  const post = GIVEAWAY_POSTS[weekNum % GIVEAWAY_POSTS.length]

  const content = `# 🎁 Giveaway — ${post.title}

${post.description}

## Comment participer
${post.howToParticipate}

## 🏆 Lot
${post.prize}

## 📅 Tirage
${post.draw}

Bonne chance à tous ! 🍀

---
*#HighValueCapital • Communauté Trading Premium*`
  return { content }
}

function buildMotivationMessage(): { content: string } {
  const dayNum = getDayOfYear()
  const post = MOTIVATION_POSTS[dayNum % MOTIVATION_POSTS.length]

  const content = `## 💪 ${post.title}

${post.body}

💬 **${post.cta}**

---
*#HighValueCapital • Communauté Trading Premium*`

  return { content }
}

// --- MAIN HANDLER ---

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: string[] = []

  // Post dataset (every day — psychology/discipline, not market data)
  const datasetMsg = buildDatasetMessage()
  const datasetRes = await fetch(DATASET_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...datasetMsg,
      username: 'HVC Dataset',
      avatar_url: 'https://www.highvaluecapital.club/logo-hvc-gradient.png',
    }),
  })
  results.push(`dataset: ${datasetRes.status}`)

  // Post motivation (every day)
  const motivationMsg = buildMotivationMessage()
  const motivationRes = await fetch(MOTIVATION_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...motivationMsg,
      username: 'HVC Motivation',
      avatar_url: 'https://www.highvaluecapital.club/logo-hvc-gradient.png',
    }),
  })
  results.push(`motivation: ${motivationRes.status}`)

  // Post giveaway (Mondays only)
  const giveawayMsg = buildGiveawayMessage()
  if (giveawayMsg) {
    const giveawayRes = await fetch(GIVEAWAY_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...giveawayMsg,
        username: 'HVC Giveaway',
        avatar_url: 'https://www.highvaluecapital.club/logo-hvc-gradient.png',
      }),
    })
    results.push(`giveaway: ${giveawayRes.status}`)
  } else {
    results.push('giveaway: skipped (not Monday)')
  }

  return NextResponse.json({ ok: true, results })
}
