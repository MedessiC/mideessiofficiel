import { useState } from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, Heart, BookOpen, Brain, Zap, Plus, X } from 'lucide-react';
import SEO from '../components/SEO';

const Careers = () => {
  const [expandedJob, setExpandedJob] = useState<number | null>(null);

  const jobs = [
    {
      id: 1,
      title: 'Développeur Front-End React/TypeScript',
      department: 'Développement',
      type: 'CDI',
      location: 'Cotonou, Bénin',
      level: 'Mid-Level / Senior',
      description: 'Nous recherchons un développeur front-end passionné pour rejoindre notre équipe.',
      responsibilities: [
        'Développer des interfaces web modernes et responsives avec React et TypeScript',
        'Collaborer avec les designers et back-end developers',
        'Optimiser les performances des applications',
        'Participer aux code reviews et à la documentation',
        'Contribuer à l\'amélioration des processus de développement',
      ],
      requirements: [
        '3+ ans d\'expérience avec React',
        'Maîtrise de TypeScript et des outils modernes (Vite, Webpack)',
        'Connaissance de Tailwind CSS ou équivalent',
        'Faire du Git en ligne de mire',
        'Excellent en français et anglais',
        'Passion pour le design et UX',
      ],
      benefits: [
        'Salaire compétitif',
        'Travail en équipe dynamique',
        'Formation continue',
        'Flexible sur les horaires',
        'Projets internationaux',
      ],
    },
    {
      id: 2,
      title: 'Développeur Backend Node.js / TypeScript',
      department: 'Développement',
      type: 'CDI',
      location: 'Remote',
      level: 'Mid-Level',
      description: 'Rejoignez notre équipe pour construire des APIs scalables.',
      responsibilities: [
        'Concevoir et développer des APIs REST et GraphQL',
        'Gérer les bases de données (SQL/NoSQL)',
        'Implémenter les sécurité et authentification',
        'Optimiser les performances et la scalabilité',
        'Déployer sur les serveurs et gérer l\'infrastructure',
      ],
      requirements: [
        '2+ ans d\'expérience Node.js',
        'Maîtrise de TypeScript',
        'Connaissance des bases de données (PostgreSQL/MongoDB)',
        'Expérience avec Docker',
        'Bonne compréhension des API RESTful',
        'Mentalité DevOps',
      ],
      benefits: [
        'Entièrement remote',
        'Salaire attractif',
        'Bonus de performance',
        'Équipe internationale',
        'Liberté technique',
      ],
    },
    {
      id: 3,
      title: 'Designer UI/UX',
      department: 'Design',
      type: 'CDI',
      location: 'Cotonou, Bénin',
      level: 'Confirmé',
      description: 'Créez des expériences utilisateur exceptionnelles sur nos projets.',
      responsibilities: [
        'Concevoir des interfaces intuitives et esthétiques',
        'Faire des recherches utilisateur et tests d\'usabilité',
        'Créer des wireframes et prototypes',
        'Collaborer avec l\'équipe de développement',
        'Gérer les design systems et brand consistency',
      ],
      requirements: [
        '3+ ans d\'expérience en UI/UX Design',
        'Maîtrise de Figma ou Sketch',
        'Portfolio solide avec cas d\'études',
        'Connaissance du design responsive',
        'Sensibilité aux tendances de design',
        'Excellent communicant',
      ],
      benefits: [
        'Liberté créative',
        'Projets variés',
        'Collaboration internationale',
        'Salaire selon profil',
        'Outils et formation premium',
      ],
    },
    {
      id: 4,
      title: 'Chef de Projet / Scrum Master',
      department: 'Management',
      type: 'CDI',
      location: 'Cotonou, Bénin',
      level: 'Confirmé',
      description: 'Pilotez nos projets avec excellence et leadership.',
      responsibilities: [
        'Gérer les cycles de projets en Agile/Scrum',
        'Coordonner avec les clients et les équipes',
        'Planifier les sprints et les livrables',
        'Identifier et résoudre les blocages',
        'Générer des rapports et KPIs',
      ],
      requirements: [
        '2+ ans d\'expérience en gestion de projets IT',
        'Certification Scrum ou Agile (recommandé)',
        'Excellent leadership et communication',
        'Expérience avec des équipes multidisciplinaires',
        'Maîtrise de l\'anglais',
        'Rigueur et organisation impeccable',
      ],
      benefits: [
        'Salaire attractif',
        'Équipe à motiver',
        'Projets strategiques',
        'Formation leadership',
        'Avantages sociaux',
      ],
    },
    {
      id: 5,
      title: 'Développeur Mobile Flutter/React Native',
      department: 'Développement',
      type: 'CDI',
      location: 'Remote/Cotonou',
      level: 'Mid-Level',
      description: 'Développez des applications mobiles de haute qualité.',
      responsibilities: [
        'Développer des apps iOS et Android avec Flutter ou React Native',
        'Intégrer les APIs backend',
        'Optimiser les performances mobile',
        'Implémenter le design fourni',
        'Maintenir et supporter les apps en production',
      ],
      requirements: [
        '2+ ans en développement mobile',
        'Expérience avec Flutter ET/OU React Native',
        'Connaissance des paradigmes mobile',
        'Maîtrise de Dart ou TypeScript/JavaScript',
        'Expérience App Store/Play Store',
        'Déboguer et résoudre efficacement',
      ],
      benefits: [
        'Flexible (Remote/Cotonou)',
        'Salaire compétitif',
        'Projets innovants',
        'Équipe supportive',
        'Évolution de carrière',
      ],
    },
    {
      id: 6,
      title: 'Commercial / Business Developer',
      department: 'Commerces',
      type: 'CDI + Commissions',
      location: 'Cotonou, Bénin',
      level: 'Confirmé',
      description: 'Développez notre base clients et portefeuille de contrats.',
      responsibilities: [
        'Prospection B2B et développement commercial',
        'Présenter les solutions MIDEESSI',
        'Négocier et conclure les contrats',
        'Gérer la relation client',
        'Rapporter sur les ventes et pipeline',
      ],
      requirements: [
        '2+ ans en vente B2B ou services informatiques',
        'Dynamique et proactif',
        'Excellent communicant en français/anglais',
        'Connaissance du digital/tech (plus)',
        'Réseau dans les entreprises',
        'Orientation résultats',
      ],
      benefits: [
        'Salaire fixe + commissions',
        'Opportunités illimitées',
        'Formation commerciale',
        'Voiture / Transport',
        'Bonus de performance',
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <SEO
        title="Carrières chez MIDEESSI | Rejoignez notre équipe"
        description="Explorez les opportunités de carrière chez MIDEESSI. Rejoignez une équipe passionnée de développeurs, designers et entrepreneurs en Afrique."
        keywords={['carrière', 'emploi', 'recrutement', 'MIDEESSI', 'Bénin', 'développeur', 'designer']}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white py-12 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-5 md:top-20 md:right-10 w-40 h-40 md:w-72 md:h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-5 md:bottom-20 md:left-10 w-48 h-48 md:w-96 md:h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 tracking-tight">
              Rejoignez <span className="text-gold">MIDEESSI</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed px-2 mb-8">
              Soyez part d'une équipe passionnée qui crée des solutions digitales innovantes pour l'Afrique.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Heart className="w-5 h-5 text-gold" />
                <span>Passion</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Brain className="w-5 h-5 text-gold" />
                <span>Innovation</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Zap className="w-5 h-5 text-gold" />
                <span>Impact</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-midnight dark:text-white mb-4">
              Pourquoi nous rejoindre ?
            </h2>
            <div className="w-12 sm:w-16 md:w-20 h-1 bg-gold rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: 'Apprentissage Continu',
                description: 'Formation, certifications et mentorat. Grandissez avec nous.',
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: 'Culture Inclusive',
                description: 'Diversité, respect et collaboration. Tous sont bienvenues.',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Projets Innovants',
                description: 'Travaillez sur des solutions qui changent l\'Afrique.',
              },
            ].map((value, idx) => (
              <div 
                key={idx}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 md:p-8 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                  <div className="text-gold">{value.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-midnight dark:text-white mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Listing */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-midnight dark:text-white mb-4">
              Offres Disponibles
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              {jobs.length} postes actuellement ouverts. Trouvez votre prochain défi.
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Job Header - Always Visible */}
                <button
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  className="w-full p-6 md:p-8 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
                >
                  <div className="flex-1 text-left">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-lg md:text-xl font-bold text-midnight dark:text-white">
                        {job.title}
                      </h3>
                      <span className="px-3 py-1 bg-gold/20 text-gold rounded-full text-xs md:text-sm font-semibold">
                        {job.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{job.department}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{job.level}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    {expandedJob === job.id ? (
                      <X className="w-6 h-6 text-gold" />
                    ) : (
                      <Plus className="w-6 h-6 text-gold" />
                    )}
                  </div>
                </button>

                {/* Job Details - Expandable */}
                {expandedJob === job.id && (
                  <div className="px-6 md:px-8 pb-6 md:pb-8 bg-gray-50 dark:bg-gray-800 border-t-2 border-gold/20 space-y-6">
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">{job.description}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-midnight dark:text-white mb-3 text-lg">Responsabilités</h4>
                      <ul className="space-y-2">
                        {job.responsibilities.map((resp, idx) => (
                          <li key={idx} className="flex gap-3 text-gray-700 dark:text-gray-300 text-sm md:text-base">
                            <span className="text-gold font-bold">→</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-midnight dark:text-white mb-3 text-lg">Profil Recherché</h4>
                      <ul className="space-y-2">
                        {job.requirements.map((req, idx) => (
                          <li key={idx} className="flex gap-3 text-gray-700 dark:text-gray-300 text-sm md:text-base">
                            <span className="text-gold font-bold">✓</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-midnight dark:text-white mb-3 text-lg">Avantages</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.benefits.map((benefit, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-gold/10 text-gold rounded-lg text-xs md:text-sm font-medium border border-gold/20"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gold/10">
                      <a
                        href={`mailto:hr@mideessi.com?subject=Candidature: ${job.title}`}
                        className="inline-flex items-center gap-2 bg-gold hover:bg-yellow-500 text-midnight font-bold px-6 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base"
                      >
                        <span>Postuler</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 md:py-16 lg:py-24 bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 lg:mb-6">
            Pas d'offre qui vous convient ?
          </h2>
          <div className="w-12 sm:w-16 md:w-20 h-1 bg-gold mx-auto rounded-full mb-6 md:mb-8"></div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-6 md:mb-8 lg:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            Envoyez-nous votre CV et une note pour nous parler de vous. On adore découvrir des talents.
          </p>
          <a
            href="mailto:hr@mideessi.com?subject=Candidature Spontanée"
            className="inline-flex items-center gap-2 bg-gold hover:bg-yellow-500 text-midnight font-bold px-6 md:px-8 py-2.5 md:py-3 lg:py-4 rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base"
          >
            <span>Envoyer votre candidature</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Careers;
