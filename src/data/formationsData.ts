export interface FormationModule {
  number: string;
  title: string;
  description: string;
}

export interface FormationQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FormationBlockDetail {
  title: string;
  text: string;
}

export interface FormationBlock {
  id: string;
  title: string;
  objective: string;
  duration: string;
  project: string;
  deliverable: string;
  lessons: string[];
  details: FormationBlockDetail[];
  quiz: FormationQuizQuestion[];
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
  roadmap?: FormationBlock[];
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
    roadmap: [
      {
        id: 'fondamentaux-web',
        title: 'Fondamentaux du Web',
        objective: 'Comprendre le fonctionnement d’un site web et le rôle des technologies du web.',
        duration: '30 min',
        project: 'Expliquer le fonctionnement d’un site web avec un exemple local.',
        deliverable: 'Une courte explication écrite de 5 lignes.',
        lessons: ['Internet et navigateur', 'Site web ou application ?', 'Serveur et page web', 'Front-end / back-end'],
        details: [
          {
            title: 'Le web n’est pas une application isolée',
            text: 'Le web repose sur une logique de réseau. Un site n’est pas simplement un fichier que tu ouvres sur ton ordinateur. Il est généralement stocké sur un serveur, puis envoyé à ton navigateur quand tu demandes une page.'
          },
          {
            title: 'Le navigateur est la fenêtre de lecture',
            text: 'Le navigateur lit le code du site, le transforme en une interface visible et te permet d’interagir avec les boutons, les liens et les formulaires.'
          },
          {
            title: 'Internet est le réseau, le site est la ressource',
            text: 'Internet réunit des millions d’appareils connectés. Un site web est une ressource disponible sur ce réseau, accessible à travers une adresse et un serveur.'
          }
        ],
        quiz: [
          {
            question: 'Qu’est-ce qu’un site web ?',
            options: ['Un fichier PDF', 'Un ensemble de pages accessibles dans un navigateur', 'Un logiciel installé sur un téléphone', 'Une clé USB'],
            correctIndex: 1,
            explanation: 'Un site web est un ensemble de pages et de ressources accessibles via un navigateur.'
          },
          {
            question: 'Quel outil permet d’afficher une page web ?',
            options: ['Le navigateur', 'Le lecteur PDF', 'Le gestionnaire de fichiers', 'Le clavier'],
            correctIndex: 0,
            explanation: 'Le navigateur est l’outil qui interprète le code HTML, CSS et JavaScript.'
          },
          {
            question: 'Le serveur a pour rôle principal de :',
            options: ['Afficher les images sur le disque', 'Stocker et envoyer les pages demandées', 'Créer des fichiers Word', 'Supprimer le navigateur'],
            correctIndex: 1,
            explanation: 'Le serveur reçoit les requêtes et envoie les fichiers nécessaires au navigateur.'
          },
          {
            question: 'Le front-end correspond à :',
            options: ['La partie visible dans le navigateur', 'La base de données', 'Le système d’exploitation', 'Le wifi'],
            correctIndex: 0,
            explanation: 'Le front-end est ce que voit et utilise l’utilisateur dans le navigateur.'
          },
          {
            question: 'Le back-end sert surtout à :',
            options: ['Dessiner des couleurs', 'Gérer la logique et les données', 'Modifier la police du site', 'Supprimer les liens'],
            correctIndex: 1,
            explanation: 'Le back-end gère les données, la logique serveur et les traitements.'
          }
        ]
      },
      {
        id: 'html-basics',
        title: 'HTML',
        objective: 'Construire la structure d’une page web avec les balises de base.',
        duration: '45 min',
        project: 'Créer une page HTML simple contenant du texte, des liens, une image et une liste.',
        deliverable: 'Un fichier HTML fonctionnel et lisible.',
        lessons: ['Balises de titre', 'Paragraphes et listes', 'Liens et images', 'Sections et structure'],
        details: [
          {
            title: 'La structure d’une page',
            text: 'Le HTML structure le contenu d’une page : titres, paragraphes, listes, liens, images et sections. Il donne une signification logique au document.'
          },
          {
            title: 'Les balises donnent du sens',
            text: 'En HTML, chaque balise a un rôle précis. Une balise h1 représente un titre principal, un p un paragraphe, et un a un lien cliquable.'
          },
          {
            title: 'L’architecture du contenu vient avant le style',
            text: 'Avant de penser au design, il faut organiser le contenu de façon claire. Une bonne structure facilite l’accès, la maintenance et la compréhension du site.'
          }
        ],
        quiz: [
          {
            question: 'Quelle balise sert à créer un titre principal ?',
            options: ['<p>', '<h1>', '<img>', '<ul>'],
            correctIndex: 1,
            explanation: 'La balise <h1> représente le titre principal de la page.'
          },
          {
            question: 'Quelle balise permet d’insérer une image ?',
            options: ['<img>', '<link>', '<a>', '<section>'],
            correctIndex: 0,
            explanation: 'La balise <img> permet d’ajouter une image.'
          },
          {
            question: 'Quelle balise crée un lien ?',
            options: ['<button>', '<a>', '<div>', '<span>'],
            correctIndex: 1,
            explanation: 'La balise <a> crée un lien cliquable.'
          },
          {
            question: 'Quelle balise sert à créer une liste non ordonnée ?',
            options: ['<ol>', '<ul>', '<li>', '<table>'],
            correctIndex: 1,
            explanation: 'La balise <ul> crée une liste non ordonnée.'
          },
          {
            question: 'Quel attribut décrit une image si elle ne s’affiche pas ?',
            options: ['href', 'src', 'alt', 'class'],
            correctIndex: 2,
            explanation: 'L’attribut alt décrit l’image lorsque celle-ci n’est pas visible.'
          }
        ]
      },
      {
        id: 'css-bases',
        title: 'CSS de base',
        objective: 'Styliser et organiser le contenu d’une page web.',
        duration: '1h',
        project: 'Styliser une page HTML en ajoutant couleurs, typographie et mise en page.',
        deliverable: 'Une page HTML + CSS cohérente et lisible.',
        lessons: ['Sélecteurs', 'Couleurs', 'Typographie', 'Boîte et margin/padding'],
        details: [
          {
            title: 'Le CSS donne la présentation',
            text: 'Le CSS est la couche de style. Il permet de contrôler couleurs, espacements, tailles, police, disposition et cohérence visuelle du site.'
          },
          {
            title: 'Les sélecteurs ciblent précisément',
            text: 'Un sélecteur CSS permet de cibler un élément ou une famille d’éléments pour appliquer des règles de style. Cela rend le code plus modulaire et plus maintenable.'
          },
          {
            title: 'Les dimensions et l’espace importent',
            text: 'La marge, le padding, la largeur et la hauteur structurent visuellement le contenu. Un bon design repose sur des proportions harmonieuses.'
          }
        ],
        quiz: [
          {
            question: 'À quoi sert le CSS ?',
            options: ['À structurer le contenu', 'À ajouter du style à la page', 'À créer des bases de données', 'À envoyer des mails'],
            correctIndex: 1,
            explanation: 'Le CSS sert à styliser la page et à la rendre plus agréable visuellement.'
          },
          {
            question: 'Quelle propriété contrôle la couleur du texte ?',
            options: ['background-color', 'color', 'font-size', 'display'],
            correctIndex: 1,
            explanation: 'La propriété color définit la couleur du texte.'
          },
          {
            question: 'Quelle propriété change la taille du texte ?',
            options: ['font-size', 'padding', 'margin', 'border'],
            correctIndex: 0,
            explanation: 'font-size contrôle la taille du texte.'
          },
          {
            question: 'Que fait la propriété margin ?',
            options: ['Elle ajoute un espace à l’intérieur d’un élément', 'Elle ajoute un espace à l’extérieur d’un élément', 'Elle cache le texte', 'Elle supprime la couleur'],
            correctIndex: 1,
            explanation: 'La margin crée de l’espace autour d’un élément.'
          },
          {
            question: 'Le sélecteur .card cible :',
            options: ['Une balise HTML nommée card', 'Un élément ayant la classe card', 'Un id unique', 'Le body'],
            correctIndex: 1,
            explanation: 'Le point . indique qu’on cible une classe CSS.'
          }
        ]
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
