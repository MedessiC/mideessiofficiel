export interface DevServiceFeature {
  name: string;
  included: boolean;
}

export interface DevService {
  id: string;
  slug: string;
  nom: string;
  description: string;
  fullDescription: string;
  delai: string;
  prixDebut: number;
  icon: string;
  image: string;
  features: DevServiceFeature[];
  pourQui: string;
  processus: string[];
  bonus: string[];
}

export const devServices: DevService[] = [
  {
    id: 'vitrine',
    slug: 'vitrine',
    nom: 'Site web vitrine',
    description: 'Un site professionnel pour présenter votre entreprise, vos services et attirer des clients. Design moderne, responsive, optimisé pour les moteurs de recherche.',
    fullDescription: 'Votre première impression numérique. Un site vitrine qui raconte votre histoire, montre votre expertise et convertit les visiteurs en clients. Avec SEO intégré, votre site est trouvable dès le départ.',
    delai: '2-3 semaines',
    prixDebut: 150000,
    icon: 'Globe',
    image: '/dev-vitrine.webp',
    features: [
      { name: '5-8 pages professionals', included: true },
      { name: 'Design responsive (mobile, tablette, desktop)', included: true },
      { name: 'Optimisation SEO de base', included: true },
      { name: 'Formulaire de contact', included: true },
      { name: 'Intégration Google Analytics', included: true },
      { name: 'Intégration WhatsApp', included: true },
      { name: 'Blog intégré', included: false },
      { name: 'Statistiques et rapports avancés', included: false },
      { name: 'Maintenance incluse 3 mois', included: true },
      { name: 'SSL Certificate (HTTPS)', included: true },
    ],
    pourQui: 'Entrepreneurs, agences, PME souhaitant une présence digitale professionnelle',
    processus: [
      'Consultation de vos besoins et identité visuelle',
      'Conception des wireframes et mockups',
      'Développement du site avec technologies modernes',
      'Tests & optimisation performance',
      'Livraison et formation'
    ],
    bonus: [
      'Photos produits/équipe optimisées',
      'Redirection domaine gratuite',
      'Configuration email personnalisée'
    ]
  },
  {
    id: 'ecommerce',
    slug: 'ecommerce',
    nom: 'Site e-commerce',
    description: 'Une boutique en ligne complète avec panier, paiement sécurisé, gestion de stock et suivi de commandes. Prêt à vendre dès le jour 1.',
    fullDescription: 'Transformez vos ventes physiques en empire digital. Plateforme e-commerce robuste avec système de paiement sécurisé, gestion d\'inventaire automatisée et tableau de bord intuitive pour suivre chaque vente en temps réel.',
    delai: '3-4 semaines',
    prixDebut: 300000,
    icon: 'ShoppingCart',
    image: '/dev-ecommerce.webp',
    features: [
      { name: 'Jusqu\'à 1000 produits', included: true },
      { name: 'Panier et checkout optimisé', included: true },
      { name: 'Paiement Orange Money, MTN Momo, carte bancaire', included: true },
      { name: 'Gestion de stock automatisée', included: true },
      { name: 'Notifications de commande (email + SMS)', included: true },
      { name: 'Espace client (historique commandes)', included: true },
      { name: 'Rapports de vente détaillés', included: true },
      { name: 'Support client 24/5', included: true },
      { name: 'Blog intégré', included: true },
      { name: 'Maintenance 6 mois incluse', included: true },
    ],
    pourQui: 'E-commerçants, boutiques, distributeurs souhaitant vendre en ligne',
    processus: [
      'Audit de votre catalogue produit',
      'Architecture de la boutique',
      'Intégration des paiements (Orange, MTN, Carte)',
      'Migration produits existants',
      'Formation équipe + livraison'
    ],
    bonus: [
      'Email de relance panier abandonné',
      'Certificat SSL gratuit',
      'Optimisation images produits'
    ]
  },
  {
    id: 'mobile',
    slug: 'mobile',
    nom: 'Application mobile',
    description: 'Une app iOS et Android native ou cross-platform pour engager vos clients avec une expérience fluide et native sur leurs phones.',
    fullDescription: 'Soyez dans la poche de vos clients. Application native ou cross-platform qui booste l\'engagement, la fidélité et les ventes. Notifications push, géolocalisation, paiements intégrés — tout ce qu\'il faut.',
    delai: '6-8 semaines',
    prixDebut: 500000,
    icon: 'Smartphone',
    image: '/dev-mobile.webp',
    features: [
      { name: 'iOS et Android (cross-platform)', included: true },
      { name: 'Design UX/UI professionnel', included: true },
      { name: 'Notifications push', included: true },
      { name: 'Authentification utilisateur', included: true },
      { name: 'Intégration API backend', included: true },
      { name: 'Paiements in-app', included: true },
      { name: 'Synchronisation données cloud', included: true },
      { name: 'Support offline mode', included: false },
      { name: 'Analytics complets', included: true },
      { name: 'Maintenance 3 mois incluse', included: true },
    ],
    pourQui: 'Startups, services, commerces voulant créer une communauté mobile',
    processus: [
      'Définition features et user flows',
      'Design prototypes interactifs',
      'Développement iOS + Android',
      'Tests bêta utilisateurs',
      'Soumission stores + livraison'
    ],
    bonus: [
      'App Store optimization (ASO)',
      'Intégration WhatsApp notifications',
      'Guide marketing App Store'
    ]
  },
  {
    id: 'webapp',
    slug: 'webapp',
    nom: 'Application web sur mesure',
    description: 'Un outil numérique robuste et scalable spécialement conçu pour vos besoins. CRM, gestion de projets, plateforme SaaS, etc.',
    fullDescription: 'Résolvez vos vrais problèmes avec du software fait pour vous. CRM pour vendre plus, plateforme pour servir vos clients, ou outil interne pour optimiser votre équipe. C\'est votre avantage compétitif.',
    delai: '8-12 semaines',
    prixDebut: 800000,
    icon: 'Code',
    image: '/dev-webapp.webp',
    features: [
      { name: 'Design UX/UI sur-mesure', included: true },
      { name: 'Base de données scalable', included: true },
      { name: 'API pour intégrations tierces', included: true },
      { name: 'Authentification sécurisée', included: true },
      { name: 'Dashboard analytiques', included: true },
      { name: 'Backup automatique', included: true },
      { name: 'Support SSL/HTTPS', included: true },
      { name: 'Déploiement infrastructure performante', included: true },
      { name: 'Tests qualité complets', included: true },
      { name: 'Documentation & training', included: true },
    ],
    pourQui: 'Entreprises, agences, SaaS founders voulant un outil propriétaire',
    processus: [
      'Workshops discovery + user stories',
      'Architecture technique détaillée',
      'Sprints développement agile',
      'Tests QA rigoureux',
      'Déploiement et documentation'
    ],
    bonus: [
      'Conseil architecture scalabilité',
      'Formation équipe technique',
      'Plan de maintenance roadmap'
    ]
  },
  {
    id: 'playstore',
    slug: 'playstore',
    nom: 'Publication App Store',
    description: 'Mise en place complète de votre app sur les stores : optimisation de la fiche, gestion des soumissions, compliance, versioning.',
    fullDescription: 'Ne laissez pas votre app rester invisible. Nous gérons toute la complexité : approbation stores, optimisation listing, gestion versions, métriques. Votre app sera trouvable et téléchargée.',
    delai: '1-2 semaines',
    prixDebut: 50000,
    icon: 'PackageOpen',
    image: '/dev-playstore.webp',
    features: [
      { name: 'Setup complet Apple Developer & Google Play Console', included: true },
      { name: 'Création iTunes Connect / Play Console accounts', included: true },
      { name: 'Optimisation App Store Listing (ASO)', included: true },
      { name: 'Gestion soumission initiale', included: true },
      { name: 'Screenshots + descriptions optimisées', included: true },
      { name: 'Gestion des reviews utilisateurs', included: true },
      { name: 'Support pour rejets / resoumissions', included: true },
      { name: 'Monitoring téléchargements & crashes', included: true },
      { name: 'Maintenance continue (3 mois)', included: true },
      { name: 'Guide compliance Apple & Google', included: true },
    ],
    pourQui: 'Devs, agences, entrepreneurs ayant construit une app et besoin de la publier',
    processus: [
      'Configuration comptes developer',
      'Optimisation fiche produit (screenshots, texte)',
      'Préparation soumission',
      'Gestion validation stores',
      'Suivi premiers téléchargements'
    ],
    bonus: [
      'Marketing launch checklist',
      'Feedback utilisateurs consolidé',
      'Stratégie mises à jour futures'
    ]
  }
];
