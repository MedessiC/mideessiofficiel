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
    description: 'Un site professionnel qui reflète la crédibilité de votre entreprise. Design moderne, performance optimale, référencement naturel intégré.',
    fullDescription: 'Votre site web est souvent la première impression que vos clients ont de vous. Nous créons des sites vitrines qui inspirent confiance, racontent votre histoire et convertissent les visiteurs en clients. Chaque site est conçu sur-mesure, optimisé pour le SEO et parfaitement responsive.',
    delai: '3-4 semaines',
    prixDebut: 350000,
    icon: 'Globe',
    image: '/dev-vitrine.webp',
    features: [
      { name: '5 à 10 pages professionnelles sur-mesure', included: true },
      { name: 'Design responsive (mobile, tablette, desktop)', included: true },
      { name: 'Optimisation SEO complète (on-page + technique)', included: true },
      { name: 'Formulaire de contact + intégration WhatsApp', included: true },
      { name: 'Intégration Google Analytics + Search Console', included: true },
      { name: 'Hébergement premium + certificat SSL inclus (1 an)', included: true },
      { name: 'Nom de domaine inclus (1 an)', included: true },
      { name: 'Optimisation vitesse de chargement (score 90+)', included: true },
      { name: 'Blog intégré', included: false },
      { name: 'Système de réservation en ligne', included: false },
      { name: 'Maintenance et support 3 mois inclus', included: true },
    ],
    pourQui: 'Entrepreneurs, cabinets professionnels, PME et organisations souhaitant une présence web crédible et performante',
    processus: [
      'Consultation stratégique : analyse de vos objectifs et de votre marché',
      'Conception UX/UI : wireframes et maquettes validées ensemble',
      'Développement avec technologies modernes (React, Next.js)',
      'Tests qualité multi-appareils et optimisation performance',
      'Mise en production + formation à la gestion de contenu'
    ],
    bonus: [
      'Shooting photo professionnel de votre équipe/locaux',
      'Rédaction de contenu optimisé SEO (copywriting)',
      'Configuration email professionnel (@votredomaine.com)'
    ]
  },
  {
    id: 'ecommerce',
    slug: 'ecommerce',
    nom: 'Boutique e-commerce',
    description: 'Une plateforme de vente en ligne robuste avec paiement mobile intégré (Orange Money, MTN MoMo), gestion de stock automatisée et tableau de bord complet.',
    fullDescription: 'Transformez votre activité commerciale avec une boutique en ligne professionnelle. Paiements mobiles sécurisés (Orange Money, MTN MoMo, Carte bancaire), gestion d\'inventaire intelligente, suivi de commandes automatisé et rapports de vente en temps réel. Tout est pensé pour le marché africain.',
    delai: '5-8 semaines',
    prixDebut: 800000,
    icon: 'ShoppingCart',
    image: '/dev-ecommerce.webp',
    features: [
      { name: 'Catalogue produits illimité avec variantes', included: true },
      { name: 'Panier et tunnel de vente optimisé pour la conversion', included: true },
      { name: 'Paiement sécurisé : Orange Money, MTN MoMo, Moov, Carte bancaire', included: true },
      { name: 'Gestion de stock et alertes automatiques', included: true },
      { name: 'Notifications commandes (email + SMS + WhatsApp)', included: true },
      { name: 'Espace client avec historique et suivi de commandes', included: true },
      { name: 'Tableau de bord vendeur avec rapports de vente détaillés', included: true },
      { name: 'Système de promotions, codes promo et soldes', included: true },
      { name: 'SEO e-commerce avancé (fiches produits optimisées)', included: true },
      { name: 'Blog intégré pour le content marketing', included: true },
      { name: 'Hébergement premium + SSL (1 an)', included: true },
      { name: 'Maintenance et support technique 6 mois inclus', included: true },
    ],
    pourQui: 'Commerçants, distributeurs, marques et entreprises souhaitant vendre en ligne avec une plateforme fiable et adaptée au marché africain',
    processus: [
      'Audit commercial : analyse de votre catalogue, cibles et concurrence',
      'Architecture de la boutique et parcours client optimisé',
      'Intégration complète des moyens de paiement locaux et internationaux',
      'Migration de vos produits et données existantes',
      'Formation complète de votre équipe à la gestion quotidienne'
    ],
    bonus: [
      'Stratégie de lancement e-commerce (plan marketing 30 jours)',
      'Email de relance panier abandonné automatisé',
      'Photos produits professionnelles (jusqu\'à 50 produits)'
    ]
  },
  {
    id: 'mobile',
    slug: 'mobile',
    nom: 'Application mobile',
    description: 'Une application iOS et Android performante, conçue pour engager vos utilisateurs avec une expérience fluide, intuitive et des fonctionnalités avancées.',
    fullDescription: 'Soyez dans la poche de vos clients. Nous développons des applications cross-platform (Flutter/React Native) qui offrent une expérience native sur iOS et Android. Notifications push, paiements intégrés, mode hors-ligne, géolocalisation — toutes les fonctionnalités pour créer un produit mobile de qualité professionnelle.',
    delai: '10-16 semaines',
    prixDebut: 1500000,
    icon: 'Smartphone',
    image: '/dev-mobile.webp',
    features: [
      { name: 'Application iOS et Android (cross-platform Flutter/React Native)', included: true },
      { name: 'Design UX/UI professionnel avec prototypes interactifs', included: true },
      { name: 'Notifications push personnalisées', included: true },
      { name: 'Authentification sécurisée (email, téléphone, social login)', included: true },
      { name: 'Architecture API backend robuste et scalable', included: true },
      { name: 'Paiements in-app (mobile money + carte bancaire)', included: true },
      { name: 'Synchronisation cloud temps réel', included: true },
      { name: 'Mode hors-ligne avec synchronisation automatique', included: true },
      { name: 'Analytics et tracking comportemental intégrés', included: true },
      { name: 'Publication sur App Store et Google Play incluse', included: true },
      { name: 'Tests qualité sur +10 appareils', included: true },
      { name: 'Maintenance et support technique 3 mois inclus', included: true },
    ],
    pourQui: 'Startups, entreprises de services, FinTech, entreprises de livraison et toute organisation souhaitant créer un produit mobile professionnel',
    processus: [
      'Discovery workshop : définition des fonctionnalités et user flows',
      'Design UX/UI avec prototypes cliquables validés',
      'Développement itératif en sprints de 2 semaines',
      'Tests bêta avec utilisateurs réels et corrections',
      'Publication stores + formation et documentation'
    ],
    bonus: [
      'App Store Optimization (ASO) pour maximiser la visibilité',
      'Stratégie de lancement et plan d\'acquisition utilisateurs',
      'Intégration WhatsApp Business API pour le support'
    ]
  },
  {
    id: 'webapp',
    slug: 'webapp',
    nom: 'Application web sur mesure',
    description: 'Un logiciel web robuste et scalable conçu pour vos besoins spécifiques : CRM, plateforme SaaS, outil de gestion, ERP, portail client.',
    fullDescription: 'Résolvez vos problèmes métier avec un logiciel fait pour vous. Que ce soit un CRM pour structurer vos ventes, une plateforme pour servir vos clients à grande échelle, ou un outil interne pour optimiser vos opérations — nous concevons des applications web sur-mesure qui deviennent votre avantage compétitif.',
    delai: '12-20 semaines',
    prixDebut: 2500000,
    icon: 'Code',
    image: '/dev-webapp.webp',
    features: [
      { name: 'Architecture logicielle sur-mesure et scalable', included: true },
      { name: 'Design UX/UI professionnel orienté productivité', included: true },
      { name: 'Base de données performante et sécurisée', included: true },
      { name: 'API RESTful documentée pour intégrations tierces', included: true },
      { name: 'Système d\'authentification et gestion des rôles', included: true },
      { name: 'Tableaux de bord analytiques et rapports personnalisés', included: true },
      { name: 'Sauvegardes automatiques et plan de reprise d\'activité', included: true },
      { name: 'Déploiement cloud sécurisé (AWS/GCP)', included: true },
      { name: 'Tests automatisés et assurance qualité complète', included: true },
      { name: 'Documentation technique et fonctionnelle complète', included: true },
      { name: 'Formation de votre équipe (administrateurs + utilisateurs)', included: true },
      { name: 'Maintenance et support technique 6 mois inclus', included: true },
    ],
    pourQui: 'Entreprises, institutions, startups SaaS et organisations nécessitant un outil digital sur-mesure pour structurer et scaler leurs opérations',
    processus: [
      'Ateliers discovery : cartographie des processus et cahier des charges fonctionnel',
      'Architecture technique détaillée et choix technologiques validés',
      'Développement agile en sprints avec démos régulières',
      'Tests qualité rigoureux (unitaires, intégration, performance)',
      'Déploiement progressif, migration de données et accompagnement'
    ],
    bonus: [
      'Conseil en architecture pour la scalabilité long terme',
      'Intégration avec vos outils existants (ERP, comptabilité, etc.)',
      'Roadmap produit sur 12 mois avec priorisation des évolutions'
    ]
  },
  {
    id: 'playstore',
    slug: 'playstore',
    nom: 'Publication & gestion App Stores',
    description: 'Prise en charge complète de la publication et de l\'optimisation de votre application sur l\'App Store et Google Play. Soumission, ASO, conformité et suivi.',
    fullDescription: 'Ne laissez pas la complexité des stores bloquer votre lancement. Nous gérons tout : création des comptes développeur, optimisation du listing (ASO), soumission conforme aux guidelines Apple/Google, gestion des rejets et mises à jour. Votre app sera visible, bien référencée et conforme.',
    delai: '1-3 semaines',
    prixDebut: 100000,
    icon: 'PackageOpen',
    image: '/dev-playstore.webp',
    features: [
      { name: 'Création et configuration des comptes Apple Developer & Google Play Console', included: true },
      { name: 'Optimisation du listing App Store (ASO complet)', included: true },
      { name: 'Rédaction des descriptions optimisées (FR + EN)', included: true },
      { name: 'Création de screenshots et previews professionnels', included: true },
      { name: 'Gestion de la soumission et conformité guidelines', included: true },
      { name: 'Gestion des rejets et re-soumissions', included: true },
      { name: 'Configuration des analytics (Firebase/App Store Connect)', included: true },
      { name: 'Monitoring crashes et performance', included: true },
      { name: 'Gestion des avis et réponses utilisateurs', included: true },
      { name: 'Support mises à jour pendant 3 mois', included: true },
    ],
    pourQui: 'Développeurs, startups et agences ayant une application prête et nécessitant une publication professionnelle et optimisée',
    processus: [
      'Configuration et sécurisation des comptes développeur',
      'Préparation des assets visuels et textes optimisés',
      'Revue de conformité et préparation de la soumission',
      'Soumission et suivi du processus de validation',
      'Suivi des premiers KPIs post-lancement'
    ],
    bonus: [
      'Plan de lancement marketing (checklist complète)',
      'Rapport consolidé des premiers retours utilisateurs',
      'Stratégie de versioning et roadmap mises à jour'
    ]
  }
];
