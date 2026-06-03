export interface TeamMember {
  id: string;
  name: string;
  role: string;
  shortDescription: string;
  fullBio: string;
  joinDate: string;
  education: string;
  skills: string[];
  specialties: string[];
  passions: string[];
  image: string;
  location: string;
  email?: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  projects: Project[];
}

export interface Project {
  title: string;
  description: string;
  link?: string;
  image?: string;
  technologies?: string[];
}

export const teamMembers: TeamMember[] = [
  {
    id: 'oscar-djihokin',
    name: 'Oscar DJIHOKIN',
    role: 'Cybersécurité & Machine Learning',
    shortDescription: 'Spécialiste en cybersécurité et machine learning, passionné par la science physique et mathématique.',
    fullBio: `Oscar DJIHOKIN est un expert en cybersécurité et machine learning qui apporte une perspective fondamentale à MIDEESSI. 
    Étudiant en 3ème année en cybersécurité, il combine sa formation académique avec une passion profonde pour les sciences 
    physiques et mathématiques. Depuis novembre 2025, Oscar travaille avec dévouement pour renforcer la sécurité des solutions 
    MIDEESSI et intégrer l'intelligence artificielle dans nos projets. Son approche rigoureuse et sa curiosité scientifique font 
    de lui un atout précieux pour le mouvement.`,
    joinDate: 'novembre 2025',
    education: 'Étudiant en 3ème année - Cybersécurité',
    skills: ['Cybersécurité', 'Machine Learning', 'Python', 'Analyse de données', 'Cryptographie'],
    specialties: ['Sécurité des systèmes', 'Intelligence artificielle', 'Analyse algorithmique'],
    passions: ['Science physique', 'Mathématique', 'Technologie émergeante', 'Innovation'],
    image: 'https://i.imgur.com/MjMbn8R.jpeg',
    location: 'Bénin',
    email: 'oscar@mideessi.com',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      portfolio: '#'
    },
    projects: [
      {
        title: 'Système de sécurité IoT',
        description: 'Développement d\'un système de sécurité basé sur l\'IA pour les dispositifs connectés béninois.',
        technologies: ['Python', 'TensorFlow', 'Socket.io']
      },
      {
        title: 'Analyse prédictive des menaces',
        description: 'Algorithme de machine learning pour prédire et prévenir les menaces de cybersécurité.',
        technologies: ['Machine Learning', 'Data Analysis', 'Python']
      }
    ]
  },
  {
    id: 'richy-anguilet-zinvo',
    name: 'Richy ANGUILET ZINVO',
    role: 'Développeur Web Junior',
    shortDescription: 'Développeur web junior passionné d\'informatique et des technologies modernes.',
    fullBio: `Richy ANGUILET ZINVO est un développeur web junior dynamique qui apporte enthousiasme et fraîcheur à MIDEESSI. 
    Étudiant en 2ème année, il se démarque par sa passion genuine pour l'informatique et son engagement envers l'excellence. 
    Depuis septembre 2025, Richy contribue activement au développement des solutions web de MIDEESSI, en apprenant 
    continuellement et en se perfectionnant. Son énergie, sa curiosité et sa détermination font de lui un exemple pour 
    les jeunes talents béninois en informatique.`,
    joinDate: 'septembre 2025',
    education: 'Étudiant en 2ème année - Informatique',
    skills: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML/CSS', 'Node.js'],
    specialties: ['Développement frontend', 'Responsive design', 'UX/UI'],
    passions: ['Informatique', 'Développement web', 'Design moderne', 'Innovation technologique'],
    image: 'https://i.imgur.com/T0QH4B6.jpeg',
    location: 'Bénin',
    email: 'richy@mideessi.com',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      portfolio: '#'
    },
    projects: [
      {
        title: 'Plateforme e-commerce locale',
        description: 'Développement d\'une plateforme e-commerce optimisée pour les petits commerces béninois.',
        technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB']
      },
      {
        title: 'Interface de gestion MIDEESSI',
        description: 'Création de l\'interface responsive pour la gestion des projets MIDEESSI.',
        technologies: ['React', 'Tailwind CSS', 'TypeScript']
      }
    ]
  }
];

export default teamMembers;
