import { ArrowRight, ExternalLink, CheckCircle, Users, Zap, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { solutions } from '../data/solutions';

const Projects = () => {
  const statusColors: { [key: string]: string } = {
    'Disponible': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'En cours': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'En développement': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Planifié': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  };

  const statusDescriptions: { [key: string]: string } = {
    'Disponible': 'Prêt à l\'utilisation',
    'En cours': 'Développement actif',
    'En développement': 'Phase de création',
    'Planifié': 'Prochainement disponible',
  };

  const technologies = [
    'Python', 'TypeScript', 'React', 'Node.js', 
    'TensorFlow', 'Docker', 'PostgreSQL', 'AWS'
  ];

  return (
    <div className="min-h-screen pt-16">
      <SEO
        title="Nos Solutions | MIDEESSI - Automatisation et IA"
        description="Découvrez notre gamme complète de solutions d'automatisation et d'intelligence artificielle : organisateur de fichiers, applications Essor et Tcha-Tcha, et plus encore."
        keywords={['solutions', 'automatisation', 'IA', 'projets', 'applications', 'MIDEESSI', 'technologie']}
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center tracking-tight">
            Nos <span className="text-gold">Solutions</span>
          </h1>
          <p className="text-xl md:text-2xl text-center text-gray-200 max-w-3xl mx-auto font-light">
            Découvrez notre gamme complète de solutions d'automatisation et d'intelligence artificielle
            conçues pour transformer votre façon de travailler.
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-midnight dark:text-white mb-4">
              Innovation et Automatisation
            </h2>
            <div className="w-20 h-1 bg-gold mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Chaque projet MIDEESSI est développé avec une attention particulière aux besoins réels de notre communauté.
              Nous combinons technologie de pointe et approche centrée sur l'utilisateur pour créer des solutions qui font vraiment la différence.
            </p>
          </div>

          {/* Solutions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {solutions.map((solution) => (
              <Link
                key={solution.id}
                to={`/solutions/${solution.slug}`}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img
                    src={solution.image}
                    alt={solution.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-8 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-midnight dark:text-white mb-1 group-hover:text-gold transition-colors">
                        {solution.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {solution.tagline}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap ml-4 ${
                      solution.status === 'Disponible'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {solution.status}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                    {solution.description}
                  </p>

                  {/* Key Benefits */}
                  <div className="mb-6 space-y-2">
                    {solution.benefits.slice(0, 3).map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-400">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  {solution.stats && (
                    <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {solution.stats.slice(0, 2).map((stat, idx) => (
                        <div key={idx}>
                          <div className="text-lg font-bold text-gold">{stat.value}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="inline-flex items-center text-gold font-bold text-sm group-hover:gap-2 transition-all">
                      En savoir plus
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gold transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Audience Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {solutions.map((solution) => (
              <div key={solution.id} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
                <h4 className="text-xl font-bold text-midnight dark:text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gold" />
                  {solution.name} - Cible
                </h4>
                <ul className="space-y-2">
                  {solution.targetAudience.map((audience, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                      {audience}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Status Legend Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-midnight dark:text-white mb-4">
              Légende des Statuts
            </h2>
            <div className="w-20 h-1 bg-gold mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(statusColors).map(([status, color]) => (
              <div 
                key={status} 
                className="group bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <span className={`px-5 py-2.5 rounded-full text-sm font-semibold ${color} transition-transform duration-300 group-hover:scale-105`}>
                    {status}
                  </span>
                  <span className="text-base text-gray-600 dark:text-gray-300 font-medium">
                    {statusDescriptions[status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-midnight dark:text-white mb-4">
              Technologies et Méthodologies
            </h2>
            <div className="w-20 h-1 bg-gold mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Nos projets utilisent les technologies les plus avancées en matière d'intelligence artificielle,
              d'apprentissage automatique et d'automatisation. Nous maintenons des standards de qualité élevés
              et suivons les meilleures pratiques de l'industrie.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {technologies.map((tech, index) => (
              <div 
                key={tech} 
                className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-center h-full">
                  <span className="text-base font-semibold text-midnight dark:text-white group-hover:text-gold transition-colors duration-300">
                    {tech}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-xl p-12">
            <h2 className="text-4xl font-bold text-midnight dark:text-white mb-6">
              Une Idée de Projet ?
            </h2>
            <div className="w-20 h-1 bg-gold mx-auto rounded-full mb-8"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Nous sommes toujours à l'écoute de nouvelles idées et opportunités de collaboration.
              Si vous avez un besoin spécifique ou une suggestion de projet, n'hésitez pas à nous contacter.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-midnight font-bold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Contactez-nous</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="relative py-24 bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">L'Innovation au Service de Tous</h2>
          <div className="w-20 h-1 bg-gold mx-auto rounded-full mb-10"></div>
          <p className="text-xl text-gray-200 leading-relaxed font-light">
            Chez MIDEESSI, nous croyons que la technologie doit être accessible, innovante et au service de la communauté.
            Chaque solution que nous développons reflète notre engagement envers l'excellence et l'indépendance.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Projects;