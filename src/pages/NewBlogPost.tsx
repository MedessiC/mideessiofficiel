import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Eye, Share2 } from 'lucide-react';
import SEO from '../components/SEO';
import { supabase, BlogPost } from '../lib/supabase';

const NewBlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (data) {
      setPost(data);

      await supabase
        .from('blog_posts')
        .update({ views: data.views + 1 })
        .eq('id', data.id);

      const { data: related } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .eq('category', data.category)
        .neq('id', data.id)
        .limit(3);

      if (related) setRelatedPosts(related);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-corporate-600 dark:text-corporate-300">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <SEO
        title={`${post.title} | Blog MIDEESSI`}
        description={post.excerpt}
        image={post.image_url}
        type="article"
        keywords={post.tags}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-8"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Retour au blog
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-corporate-500 dark:text-corporate-400 mb-4">
            <span className="px-3 py-1 bg-blue-600 text-white rounded-full font-semibold">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.published_at).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.views} vues
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-midnight dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-corporate-600 dark:text-corporate-300 leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        <div className="relative h-96 rounded-lg overflow-hidden mb-8">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex items-center justify-between py-4 border-y border-corporate-200 dark:border-gray-700 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-corporate-500" />
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-corporate-100 dark:bg-gray-800 text-corporate-700 dark:text-corporate-300 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <Share2 className="w-4 h-4" />
            Partager
          </button>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <div className="text-corporate-700 dark:text-corporate-200 leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-8 border-t border-corporate-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-midnight dark:text-white mb-6">
              Articles similaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group bg-corporate-50 dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all border border-corporate-200 dark:border-gray-700"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={relatedPost.image_url}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-midnight dark:text-white mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-corporate-600 dark:text-corporate-300 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

export default NewBlogPost;
