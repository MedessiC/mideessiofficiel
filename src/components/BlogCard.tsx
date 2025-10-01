import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author?: string;
}

const BlogCard = ({ id, title, excerpt, date, author = 'MIDEESSI Team' }: BlogCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
          <span>•</span>
          <span>{author}</span>
        </div>
        <h3 className="text-xl font-bold text-midnight dark:text-white mb-3 hover:text-gold transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{excerpt}</p>
        <Link
          to={`/blog/${id}`}
          className="inline-flex items-center space-x-2 text-gold hover:text-midnight dark:hover:text-white font-medium transition-colors"
        >
          <span>Lire l'article</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
