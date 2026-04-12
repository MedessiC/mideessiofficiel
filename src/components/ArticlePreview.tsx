import React, { useState, useRef, useCallback } from 'react';
import { Clock, User, ExternalLink } from 'lucide-react';
import { BlogPost } from '../lib/supabase';

interface ArticlePreviewProps {
  post: BlogPost;
  children: React.ReactNode;
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({ post, children }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateReadTime = (text: string) => Math.ceil(text.split(' ').length / 200);
  const readTime = calculateReadTime(post.excerpt);

  const handleMouseEnter = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setPreviewPos({
        x: rect.right + 10,
        y: rect.top,
      });
    }

    timeoutRef.current = setTimeout(() => {
      setShowPreview(true);
    }, 3000); // 3 secondes
  };

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShowPreview(false);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      {children}

      {/* Preview Popup */}
      {showPreview && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 w-72 max-h-96 overflow-hidden animation-fadeIn"
          style={{
            left: `${previewPos.x}px`,
            top: `${previewPos.y}px`,
            animation: 'fadeIn 0.3s ease-in-out',
          }}
          onMouseLeave={handleMouseLeave}
        >
          {/* Image */}
          <div className="relative h-40 -mx-4 -mt-4 mb-3 overflow-hidden rounded-t-xl">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs font-bold rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readTime} min
            </span>
          </div>

          {/* Titre */}
          <h3 className="text-sm font-bold text-midnight dark:text-white mb-2 line-clamp-2 hover:text-gold transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {post.excerpt}
          </p>

          {/* Author & Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{post.author}</span>
            </div>
            <a
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-1 text-gold hover:text-gold/80 transition-colors text-xs font-semibold"
            >
              Lire <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ArticlePreview;
