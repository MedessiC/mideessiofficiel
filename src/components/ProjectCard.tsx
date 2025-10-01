import { ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  status: string;
  icon?: React.ReactNode;
}

const ProjectCard = ({ title, description, status, icon }: ProjectCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      {icon && (
        <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-midnight dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium px-3 py-1 bg-gold/20 text-midnight dark:text-gold rounded-full">
          {status}
        </span>
        <button className="text-gold hover:text-midnight dark:hover:text-white transition-colors flex items-center space-x-1">
          <span className="text-sm font-medium">Voir plus</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
