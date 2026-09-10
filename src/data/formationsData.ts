export interface FormationModule {
  number: string;
  title: string;
  description: string;
}

export interface FormationItem {
  id: string;
  slug: string;
  title: string;
  heroTitle: string;
  subtitle: string;
  description: string;
  duration: string;
  level: string;
  price: number;
  priceFormatted: string;
  paymentOption: string;
  monthlyPrice: number;
  category: string;
  cover: string;
  prerequisites: string[];
  targetAudience: string;
  modules: FormationModule[];
  careerProspects: string[];
}

export const formationsData: FormationItem[] = [
  {
    id: 'formation-dev-web-3-mois',
    slug: 'developpement-web',
    title: 'Formation en Développement Web',
    heroTitle: 'Créer un site Web moderne en 2026',
    subtitle: 'Devenez développeur web autonome en 3 mois',
    description: 'Une formation pratique et intensive de 3 mois pour maîtriser les technologies indispensables du web (HTML5, CSS3, JavaScript ES6+). Obtenez des compétences directement applicables sur le marché.',
    duration: '3 mois',
    level: 'Tous niveaux',
    price: 45000,
    priceFormatted: '45 000 FCFA',
    paymentOption: '15 000 FCFA / mois (sur 3 mois avec engagement)',
    monthlyPrice: 15000,
    category: 'Développement Web',
    cover: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=1200&q=80',
    prerequisites: [
      'Aucun prérequis technique préalable requis',
      'Avoir un ordinateur portable et une connexion Internet',
      'Motivation et esprit d’apprentissage'
    ],
    targetAudience: 'Étudiants, personnes en reconversion professionnelle, entrepreneurs et passionnés souhaitant créer des sites web professionnels ou se former au métier de développeur web.',
    modules: [
      {
        number: '01',
        title: 'Fondations du Web & HTML5 / CSS3 Responsive',
        description: 'Structure des pages web, balisage sémantique, mise en page moderne avec Flexbox & CSS Grid, intégration responsive pour mobiles et ordinateurs.'
      },
      {
        number: '02',
        title: 'JavaScript ES6+ & Logique de Programmation',
        description: 'Variables, boucles, fonctions, algorithmes basiques, manipulation dynamique du DOM, événements et requêtes API avec Fetch et Async/Await.'
      },
      {
        number: '03',
        title: 'Frontend Moderne avec React.js & Tailwind CSS',
        description: 'Architecture en composants, Hooks React (useState, useEffect), gestion des états, routage dynamique et stylisation rapide avec Tailwind CSS.'
      },
      {
        number: '04',
        title: 'Initiation Backend, Node.js & Base de Données',
        description: 'Création d’un serveur API REST avec Express, gestion des requêtes HTTP, modélisation de données et stockage avec Supabase / PostgreSQL.'
      },
      {
        number: '05',
        title: 'Projet Fil Rouge & Déploiement en Ligne',
        description: 'Conception complète d’un projet d’application web de A à Z, versionning avec Git / GitHub, et mise en production (Vercel / Netlify).'
      }
    ],
    careerProspects: [
      'Développeur Web Frontend Junior',
      'Développeur Web Freelance',
      'Intégrateur Web & WordPress / Webflow',
      'Créateur de sites web pour entreprises'
    ]
  },
  {
    id: 'formation-cybersecurite-3-mois',
    slug: 'cybersecurite',
    title: 'Formation en Cybersécurité',
    heroTitle: 'Sécuriser les systèmes & données en 2026',
    subtitle: 'Protégez les systèmes, réseaux et données contre les menaces digitales',
    description: 'Une formation pratique de 3 mois pour apprendre à identifier les failles de sécurité, défendre les infrastructures informatiques, réaliser des audits de sécurité et réagir efficacement face aux cyberattaques modernes.',
    duration: '3 mois',
    level: 'Tous niveaux',
    price: 45000,
    priceFormatted: '45 000 FCFA',
    paymentOption: '15 000 FCFA / mois (sur 3 mois avec engagement)',
    monthlyPrice: 15000,
    category: 'Cybersécurité',
    cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    prerequisites: [
      'Connaissances de base de l’outil informatique',
      'Accès à un ordinateur portable et une connexion Internet stable',
      'Rigueur, curiosité et logique d’analyse'
    ],
    targetAudience: 'Informaticiens, administrateurs système, étudiants, techniciens support et professionnels désirant acquérir des compétences concrètes en sécurité informatique et protection des données.',
    modules: [
      {
        number: '01',
        title: 'Bases de la Sécurité Informatique & Systèmes',
        description: 'Principes fondamentaux de la cybersécurité (Confidentialité, Intégrité, Disponibilité), fonctionnement des systèmes Linux et Windows, gestion des permissions.'
      },
      {
        number: '02',
        title: 'Sécurité des Réseaux & Protocoles de Communication',
        description: 'Analyse du trafic réseau (Wireshark), fonctionnement des pare-feux (Firewalls), VPN, sécurité Wi-Fi et chiffrement des communications.'
      },
      {
        number: '03',
        title: 'Audit de Sécurité & Tests d’Infiltration (Pentesting)',
        description: 'Détection des vulnérabilités, balayage réseau (Nmap), identification des failles web courantes (OWASP Top 10) et initiation aux tests d’intrusion.'
      },
      {
        number: '04',
        title: 'Cryptographie, Hachage & Authentification',
        description: 'Utilisation des clés publiques/privées, certificats SSL/TLS, hachage des mots de passe, mécanismes MFA/2FA et politiques de sécurité.'
      },
      {
        number: '05',
        title: 'Réponse aux Incidents & Sécurisation Pratique',
        description: 'Détection d’intrusion, gestion des alertes de sécurité, plans de réponse aux cyberattaques, sauvegardes et atelier de sécurisation globale.'
      }
    ],
    careerProspects: [
      'Technicien Support Sécurité Informatique',
      'Auditeur de Sécurité Junior / Pentester',
      'Consultant Junior en Cybersécurité',
      'Administrateur Réseau & Sécurité'
    ]
  }
];

export const getFormationBySlug = (slug: string): FormationItem | undefined => {
  return formationsData.find((f) => f.slug === slug || f.id === slug);
};
