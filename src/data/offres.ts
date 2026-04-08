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
  whaYouGet: string[];
  forWho: string;
  note: string;
}

export const offres: Offre[] = [
  {
    id: 'kpevi',
    slug: 'kpevi',
    nom: 'Kpèvi',
    signification: 'Petit',
    prix: 30000,
    badge: undefined,
    description: 'Pour démarrer',
    tagline: 'Construisez votre présence digitale',
    subtitle: 'Idéal pour les petits entrepreneurs',
    image: '/offre-kpevi.webp',
    features: [
      { name: '2 publications stratégiques/semaine', included: true },
      { name: 'Visuels percutants (design professionnel)', included: true },
      { name: 'Légendes engageantes rédigées', included: true },
      { name: 'Réponses rapides aux commentaires', included: true },
      { name: 'Diagnostic initial offert', included: true },
      { name: 'Messages et messages privés gérés', included: false },
      { name: 'Campagnes de promotion', included: false },
      { name: 'Vidéos courtes et Reels', included: false },
      { name: 'Rapports mensuels de performance', included: false },
      { name: 'Site web vitrine inclus', included: false },
    ],
    whaYouGet: [
      'Présence régulière et professionnelle sur Facebook',
      'Contenu de qualité qui attire et fidélise vos premiers clients',
      'Pas de gestion administrative — vous vous concentrez sur votre business',
      'Diagnostic initial pour comprendre votre situation digitale actuelle'
    ],
    forWho: 'Petits entrepreneurs, micro-commerces, boutiques en ligne qui commencent et veulent une présence régulière sans investissement énorme.',
    note: 'Budget pub à la charge du client — Contrat minimum 3 mois',
  },
  {
    id: 'eya',
    slug: 'eya',
    nom: 'Eya',
    signification: 'Ça commence',
    prix: 75000,
    badge: 'Le plus populaire',
    description: 'Pour croître',
    tagline: 'Accélérez votre croissance',
    subtitle: 'Le meilleur rapport qualité/prix',
    image: '/offre-eya.webp',
    features: [
      { name: '4 publications strategiques/semaine', included: true },
      { name: 'Visuels soignés + contenu vidéo court', included: true },
      { name: 'Légendes + stories engageantes', included: true },
      { name: 'Gestion active des commentaires et messages', included: true },
      { name: '1 campagne de promotion/semaine', included: true },
      { name: 'Rapport mensuel de performance', included: true },
      { name: 'Suivi du ROI publicitaire', included: true },
      { name: 'Contenu quotidien', included: false },
      { name: 'Reels premium et videos longues', included: false },
      { name: 'Site web vitrine', included: false },
    ],
    whaYouGet: [
      'Une stratégie digitale cohérente et régulière',
      'Augmentation visible de vos ventes et engagement clients',
      'Campagnes de promotion optimisées pour les résultats',
      'Données claires chaque mois pour comprendre votre croissance',
      'Équipe dédiée qui connaît votre business'
    ],
    forWho: 'PME qui veulent une vraie stratégie : boost des ventes, fidélisation clients, augmentation de la visibilité sans faire ça eux-mêmes.',
    note: 'Budget pub à la charge du client — Contrat minimum 3 mois',
  },
  {
    id: 'jago',
    slug: 'jago',
    nom: 'Jago',
    signification: 'Riche',
    prix: 150000,
    badge: undefined,
    description: 'Pour dominer',
    tagline: 'Dominez votre marché',
    subtitle: 'Solution complète tout-en-un',
    image: '/offre-jago.webp',
    features: [
      { name: 'Présence quotidienne multi-canaux', included: true },
      { name: 'Contenu premium : Vidéos, Reels, Stories', included: true },
      { name: 'Visuels professionnels + design cohérent', included: true },
      { name: 'Campagnes de promotion hebdomadaires', included: true },
      { name: 'Rapport détaillé mensuel avec insights', included: true },
      { name: 'Site web vitrine ou e-commerce clé en main', included: true },
      { name: 'Maintenance et mises à jour du site', included: true },
      { name: 'Formations trimestrielles à votre équipe', included: true },
      { name: 'Gestion complète des réseaux sociaux', included: true },
      { name: 'Support prioritaire 24h', included: true },
    ],
    whaYouGet: [
      'Domination de votre lien digitale sur Facebook et Instagram',
      'Présence constante et professionnelle que vos concurrents ne peuvent pas ignorer',
      'Videos et contenu viral régulièrement produits',
      'Un site web professionnel qui vend ou informe selon vos besoins',
      'Vos employés formés pour comprendre les stratégies digitales',
      'ROI clairement mesuré et amélioré chaque mois'
    ],
    forWho: 'Entreprises ambitieuses qui veulent dominer leur marché : commercial fort, multi-canaux, lancement nouveau produit, croissance agressive.',
    note: 'Budget pub à la charge du client — Contrat minimum 3 mois',
  }
];

export const getOffreBySlug = (slug: string): Offre | undefined => {
  return offres.find(offre => offre.slug === slug);
};
