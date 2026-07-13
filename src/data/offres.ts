export interface Feature {
  name: string;
  included: boolean;
}

export interface Offre {
  id: string;
  slug: string;
  nom: string;
  signification: string;
  prix: number;
  badge?: string;
  description: string;
  tagline: string;
  subtitle?: string;
  image: string;
  features: Feature[];
  whatYouGet: string[];
  forWho: string;
  note: string;
}

export const offres: Offre[] = [
  {
    id: 'kpevi',
    slug: 'kpevi',
    nom: 'Kpèvi',
    signification: 'Petit',
    prix: 55000,
    badge: undefined,
    description: 'L\'essentiel pour démarrer',
    tagline: 'Posez les bases d\'une présence digitale solide',
    subtitle: 'Idéal pour les entrepreneurs et petites entreprises',
    image: '/offre-kpevi.webp',
    features: [
      { name: '3 publications/semaine (Facebook + Instagram)', included: true },
      { name: 'Visuels professionnels par nos graphistes', included: true },
      { name: 'Légendes engageantes et copywriting', included: true },
      { name: 'Modération des commentaires', included: true },
      { name: 'Audit initial de votre présence digitale', included: true },
      { name: 'Calendrier éditorial mensuel', included: true },
      { name: 'Rapport de performance mensuel', included: true },
      { name: 'Gestion des messages privés', included: false },
      { name: 'Création de contenu vidéo', included: false },
      { name: 'Campagnes publicitaires', included: false },
      { name: 'Stratégie multi-plateformes', included: false },
    ],
    whatYouGet: [
      'Présence régulière et professionnelle sur Facebook et Instagram',
      'Contenu de qualité créé par des professionnels',
      'Calendrier éditorial structuré pour ne jamais manquer de contenu',
      'Un audit complet de votre situation digitale avec recommandations',
      'Rapport mensuel clair pour mesurer votre progression',
    ],
    forWho: 'Entrepreneurs, freelances, micro-entreprises et petites PME qui débutent en ligne et veulent une présence professionnelle sans mobiliser de gros budgets.',
    note: 'Budget publicitaire non inclus — Engagement minimum 3 mois — Résiliation avec préavis de 30 jours',
  },
  {
    id: 'eya',
    slug: 'eya',
    nom: 'Eya',
    signification: 'Ça commence',
    prix: 150000,
    badge: 'Le plus choisi',
    description: 'Croissance accélérée',
    tagline: 'Stratégie digitale complète pour accélérer votre croissance',
    subtitle: 'Contenu vidéo, publicité et community management',
    image: '/offre-eya.webp',
    features: [
      { name: '5 publications/semaine (multi-plateformes)', included: true },
      { name: '2 vidéos courtes/Reels par semaine (tournage + montage)', included: true },
      { name: 'Identité visuelle cohérente et charte graphique', included: true },
      { name: 'Copywriting optimisé (SEO + engagement)', included: true },
      { name: 'Gestion complète commentaires + messages privés', included: true },
      { name: '2 campagnes publicitaires optimisées/mois', included: true },
      { name: 'Rapport analytique mensuel avec recommandations', included: true },
      { name: 'Suivi et optimisation du ROI publicitaire', included: true },
      { name: 'Community management actif', included: true },
      { name: 'Stories quotidiennes', included: true },
      { name: 'Stratégie d\'influence et partenariats', included: false },
      { name: 'Account manager dédié', included: false },
    ],
    whatYouGet: [
      'Une stratégie digitale structurée qui génère des résultats mesurables',
      'Du contenu vidéo professionnel qui renforce votre image de marque',
      'Des campagnes publicitaires ciblées pour acquérir de nouveaux clients',
      'Un community management actif qui construit une communauté engagée',
      'Des rapports détaillés avec des insights actionnables',
    ],
    forWho: 'PME en croissance, commerces établis et entreprises qui veulent passer au niveau supérieur avec du contenu premium et des campagnes publicitaires performantes.',
    note: 'Budget publicitaire non inclus — Engagement minimum 3 mois — Réunion de cadrage mensuelle incluse',
  },
  {
    id: 'jago',
    slug: 'jago',
    nom: 'Jago',
    signification: 'Riche',
    prix: 350000,
    badge: undefined,
    description: 'Domination digitale',
    tagline: 'Votre département marketing digital externalisé',
    subtitle: 'Solution complète multi-canaux avec account manager dédié',
    image: '/offre-jago.webp',
    features: [
      { name: 'Contenu quotidien multi-plateformes (Facebook, Instagram, TikTok, LinkedIn)', included: true },
      { name: 'Production vidéo premium : Reels, Shorts, Stories, Lives', included: true },
      { name: 'Direction artistique et identité de marque complète', included: true },
      { name: 'Campagnes publicitaires hebdomadaires (Meta Ads + Google Ads)', included: true },
      { name: 'Rapport stratégique bi-mensuel avec tableaux de bord', included: true },
      { name: 'Landing page optimisée pour la conversion', included: true },
      { name: 'Stratégie d\'influence : identification et gestion de partenariats', included: true },
      { name: 'Email marketing : setup + 2 newsletters/mois', included: true },
      { name: 'Veille concurrentielle et benchmark mensuel', included: true },
      { name: 'Account manager dédié + support prioritaire', included: true },
      { name: 'Formation trimestrielle de votre équipe', included: true },
      { name: 'Shooting photo professionnel trimestriel', included: true },
    ],
    whatYouGet: [
      'Un département marketing digital complet externalisé',
      'Une présence dominante sur tous les canaux qui vous différencie',
      'Du contenu vidéo et photo de qualité professionnelle',
      'Des campagnes multi-canaux optimisées pour maximiser le ROI',
      'Un account manager dédié qui pilote votre stratégie',
      'Des formations pour rendre votre équipe autonome',
    ],
    forWho: 'Entreprises établies, grandes PME et marques ambitieuses qui veulent dominer leur marché avec une stratégie digitale intégrée et un partenaire fiable.',
    note: 'Budget publicitaire non inclus — Engagement minimum 6 mois — Réunion stratégique bi-mensuelle — Clause de performance incluse',
  },
];

export const getOffreBySlug = (slug: string): Offre | undefined => {
  return offres.find(offre => offre.slug === slug);
};
