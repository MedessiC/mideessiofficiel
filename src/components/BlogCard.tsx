import { Calendar, ArrowRight, User, BookOpen } from 'lucide-react';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author?: string;
}

const BlogCard = ({ id, title, excerpt, date, author = 'MIDEESSI Team' }: BlogCardProps) => {
  // Parse date for better formatting
  const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <a href={`/blog/${id}`} className="group block h-full">
      <div className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] border border-gray-200 dark:border-gray-700 hover:border-gold/50 flex flex-col">
        {/* Header with Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-gold via-yellow-400 to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Content Container */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col">
          {/* Icon Section */}
          <div className="mb-4 md:mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gold/10 group-hover:bg-gold/20 rounded-lg md:rounded-xl transition-colors duration-300">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-gold" />
            </div>
          </div>

          {/* Title - Responsive */}
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-midnight dark:text-white mb-2 sm:mb-3 md:mb-4 lg:mb-5 line-clamp-2 group-hover:text-gold transition-colors duration-300 leading-tight">
            {title}
          </h3>

          {/* Excerpt - Responsive */}
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 md:mb-6 lg:mb-7 line-clamp-3 flex-grow leading-relaxed">
            {excerpt}
          </p>

          {/* Meta Info - Responsive */}
          <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-4 sm:mb-6 md:mb-8 pb-3 sm:pb-4 md:pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs sm:text-xs md:text-sm lg:text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0 text-gold" />
              <span className="leading-snug">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-xs md:text-sm lg:text-sm text-gray-500 dark:text-gray-400">
              <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0 text-gold" />
              <span className="font-medium leading-snug">{author}</span>
            </div>
          </div>

          {/* CTA Button - Responsive */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 group/cta">
            <span className="text-xs sm:text-sm md:text-base lg:text-base font-semibold text-gold group-hover:text-gold transition-colors duration-300">
              Lire l'article
            </span>
            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gold/10 group-hover/cta:bg-gold group-hover/cta:text-midnight rounded-lg md:rounded-xl transition-all duration-300 transform group-hover/cta:translate-x-1">
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gold group-hover/cta:text-midnight transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/* Bottom Accent - Only visible on hover */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </a>
  );
};

export default BlogCard;
