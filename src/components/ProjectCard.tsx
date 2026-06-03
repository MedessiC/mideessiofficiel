import { ExternalLink, Github, ChevronRight } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  status: string;
  icon: JSX.Element;
  technologies?: string[];
  features?: string[];
  demoUrl?: string;
  githubUrl?: string;
}

const ProjectCard = ({ 
  title, 
  description, 
  status, 
  icon,
  technologies = [],
  features = [],
  demoUrl,
  githubUrl
}: ProjectCardProps) => {
  const statusColors: { [key: string]: string } = {
    'Disponible': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
    'En cours': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    'En développement': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    'Planifié': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  };

  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 h-full flex flex-col">
      {/* Header avec icône et statut */}
      <div className="relative p-6 pb-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gold/20 to-yellow-500/20 dark:from-gold/10 dark:to-yellow-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'} whitespace-nowrap`}>
            {status}
          </span>
        </div>
        
        <h3 className="text-lg sm:text-xl font-bold text-midnight dark:text-white mb-2 line-clamp-2">
          {title}
        </h3>
      </div>

      {/* Contenu principal */}
      <div className="p-6 pt-4 flex-grow flex flex-col">
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3 flex-grow">
          {description}
        </p>

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Technologies
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {technologies.slice(0, 4).map((tech, index) => (
                <span 
                  key={index}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 4 && (
                <span className="px-2.5 py-1 bg-gold/10 text-gold rounded-md text-xs font-medium">
                  +{technologies.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Features */}
        {features.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Fonctionnalités clés
            </h4>
            <ul className="space-y-1.5">
              {features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <ChevronRight className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-midnight font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Demo</span>
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-all duration-300 text-sm"
            >
              <Github className="w-4 h-4" />
              <span>Code</span>
            </a>
          )}
          {!demoUrl && !githubUrl && (
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold rounded-lg cursor-not-allowed text-sm"
              disabled
            >
              <span>Bientôt disponible</span>
            </button>
          )}
        </div>
      </div>

      {/* Indicateur de vedette (si nécessaire) */}
      {status === 'Disponible' && (
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[60px] border-t-gold/20 border-l-[60px] border-l-transparent">
          <div className="absolute -top-[55px] right-[5px] transform rotate-45">
            <span className="text-xs font-bold text-gold">★</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;