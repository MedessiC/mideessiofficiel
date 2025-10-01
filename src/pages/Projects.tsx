import { FolderTree, Rocket, MessageSquare, Bot, FileCode, Sparkles } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const projects = [
    {
      title: 'Organisateur de Fichiers Automatique',
      description: 'Un outil intelligent qui trie, organise et renomme vos fichiers automatiquement selon vos règles personnalisées. Gagnez des heures précieuses chaque semaine.',
      status: 'Disponible',
      icon: <FolderTree className="w-6 h-6 text-gold" />,
    },
    {
      title: 'Application Essor',
      description: 'Plateforme collaborative de gestion de projets conçue pour les communautés technologiques. Suivez vos objectifs, coordonnez vos équipes et réalisez vos ambitions.',
      status: 'En cours',
      icon: <Rocket className="w-6 h-6 text-gold" />,
    },
    {
      title: 'Application Tcha-Tcha',
      description: 'Solution de communication en temps réel optimisée pour les équipes distribuées. Messagerie instantanée, partage de fichiers et collaboration fluide.',
      status: 'En cours',
      icon: <MessageSquare className="w-6 h-6 text-gold" />,
    },
    {
      title: 'Assistant IA Personnel',
      description: 'Un assistant intelligent qui apprend de vos habitudes et vous aide à automatiser vos tâches quotidiennes. Productivité maximale avec un effort minimal.',
      status: 'En développement',
      icon: <Bot className="w-6 h-6 text-gold" />,
    },
    {
      title: 'Générateur de Code Intelligent',
      description: 'Outil basé sur l\'IA pour générer du code de qualité professionnelle. Accélérez votre développement tout en maintenant les meilleures pratiques.',
      status: 'Planifié',
      icon: <FileCode className="w-6 h-6 text-gold" />,
    },
    {
      title: 'Optimiseur de Processus',
      description: 'Analysez et optimisez vos workflows avec notre intelligence artificielle. Identifiez les goulets d\'étranglement et améliorez votre efficacité opérationnelle.',
      status: 'Planifié',
      icon: <Sparkles className="w-6 h-6 text-gold" />,
    },
  ];

  const statusColors: { [key: string]: string } = {
    'Disponible': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'En cours': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'En développement': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Planifié': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (
    <div className="min-h-screen pt-16">
      <section className="bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Nos Solutions</h1>
          <p className="text-xl text-center text-gray-200 max-w-3xl mx-auto">
            Découvrez notre gamme complète de solutions d'automatisation et d'intelligence artificielle
            conçues pour transformer votre façon de travailler.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-midnight dark:text-white mb-4 text-center">
              Innovation et Automatisation
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
              Chaque projet MIDEESSI est développé avec une attention particulière aux besoins réels de notre communauté.
              Nous combinons technologie de pointe et approche centrée sur l'utilisateur pour créer des solutions qui font vraiment la différence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="transform transition-transform hover:scale-105">
                <ProjectCard {...project} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-midnight dark:text-white mb-8 text-center">
            Légende des Statuts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-3 bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${color}`}>
                  {status}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {status === 'Disponible' && 'Prêt à l\'utilisation'}
                  {status === 'En cours' && 'Développement actif'}
                  {status === 'En développement' && 'Phase de création'}
                  {status === 'Planifié' && 'Prochainement disponible'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-midnight dark:text-white mb-6">
            Une Idée de Projet ?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Nous sommes toujours à l'écoute de nouvelles idées et opportunités de collaboration.
            Si vous avez un besoin spécifique ou une suggestion de projet, n'hésitez pas à nous contacter.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center space-x-2 bg-gold hover:bg-yellow-500 text-midnight font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            <span>Contactez-nous</span>
          </a>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Technologies et Méthodologies</h2>
          <p className="text-lg text-gray-200 mb-6">
            Nos projets utilisent les technologies les plus avancées en matière d'intelligence artificielle,
            d'apprentissage automatique et d'automatisation. Nous maintenons des standards de qualité élevés
            et suivons les meilleures pratiques de l'industrie.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {['Python', 'TypeScript', 'React', 'Node.js', 'TensorFlow', 'Docker', 'PostgreSQL', 'AWS'].map((tech) => (
              <div key={tech} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <span className="text-sm font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
