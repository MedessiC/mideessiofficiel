import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Zap, Users, Award, CheckCircle, Building2, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import { supabase, BlogPost } from '../lib/supabase';

const NewHome = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const { data: featured } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(3);

      const { data: latest } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(4);

      if (featured) setFeaturedPosts(featured);
      if (latest) setLatestPosts(latest);
    };

    fetchBlogPosts();
  }, []);

  const stats = [
    { value: '50+', label: 'Clients satisfaits' },
    { value: '100+', label: 'Projets réalisés' },
    { value: '99%', label: 'Taux de satisfaction' },
    { value: '24/7', label: 'Support disponible' },
  ];

  const services = [
    {
      icon: Zap,
      title: 'Automatisation intelligente',
      description: 'Optimisez vos processus métier avec nos solutions d\'automatisation sur mesure.',
    },
    {
      icon: Shield,
      title: 'Solutions sécurisées',
      description: 'Sécurité de niveau entreprise pour protéger vos données et vos opérations.',
    },
    {
      icon: TrendingUp,
      title: 'Croissance durable',
      description: 'Des outils évolutifs qui grandissent avec votre entreprise.',
    },
    {
      icon: Users,
      title: 'Support dédié',
      description: 'Une équipe d\'experts à votre écoute pour vous accompagner.',
    },
  ];

  const features = [
    'Technologies de pointe',
    'Déploiement rapide',
    'Support technique 24/7',
    'Formation complète',
    'Mises à jour régulières',
    'Intégration facile',
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="MIDEESSI - Solutions d'automatisation et d'intelligence artificielle pour entreprises"
        description="MIDEESSI développe des solutions d'automatisation et d'IA pour optimiser vos processus métier. Découvrez nos services professionnels et notre expertise technologique."
        keywords={['automatisation', 'IA', 'entreprise', 'solutions professionnelles', 'technologie', 'MIDEESSI']}
      />

      <section className="relative bg-gradient-to-br from-midnight via-navy to-steel text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-blue-600/20 rounded-full border border-blue-400/30">
                <span className="text-sm font-semibold">Solutions d'entreprise</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Transformez votre entreprise avec l'IA
              </h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                MIDEESSI développe des solutions d'automatisation et d'intelligence artificielle
                sur mesure pour optimiser vos processus métier et accélérer votre croissance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-midnight font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  Demander une démo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all"
                >
                  Nos solutions
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
              <img
                src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Solutions technologiques"
                className="relative rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-corporate-50 dark:bg-gray-800 border-y border-corporate-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-midnight dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-corporate-600 dark:text-corporate-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-midnight dark:text-white mb-4">
              Nos services professionnels
            </h2>
            <p className="text-lg text-corporate-600 dark:text-corporate-300 max-w-3xl mx-auto">
              Des solutions technologiques adaptées à vos besoins métier
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-corporate-50 dark:bg-gray-800 p-8 rounded-lg hover:shadow-lg transition-all border border-corporate-200 dark:border-gray-700"
              >
                <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-midnight dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-corporate-600 dark:text-corporate-300">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-corporate-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-midnight dark:text-white mb-6">
                Pourquoi choisir MIDEESSI ?
              </h2>
              <p className="text-lg text-corporate-600 dark:text-corporate-300 mb-8">
                Nous combinons expertise technique et compréhension métier pour livrer
                des solutions qui génèrent de vrais résultats.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-corporate-700 dark:text-corporate-200">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-midnight dark:bg-corporate-800 p-8 rounded-lg text-white">
              <Award className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Excellence reconnue</h3>
              <p className="text-gray-300 mb-6">
                Notre engagement envers l'excellence et l'innovation nous a permis de devenir
                un partenaire de confiance pour de nombreuses entreprises.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold"
              >
                En savoir plus sur nous
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-midnight dark:text-white mb-4">
                Articles à la une
              </h2>
              <p className="text-lg text-corporate-600 dark:text-corporate-300">
                Nos dernières publications et actualités
              </p>
            </div>
            <Link
              to="/blog"
              className="hidden md:inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              Voir tous les articles
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {featuredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-corporate-50 dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all border border-corporate-200 dark:border-gray-700"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                      À la une
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-corporate-500 dark:text-corporate-400 mb-2">
                    {new Date(post.published_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <h3 className="text-xl font-bold text-midnight dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-corporate-600 dark:text-corporate-300 text-sm line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="md:hidden text-center">
            <Link
              to="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              Voir tous les articles
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-midnight dark:bg-corporate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Building2 className="w-16 h-16 text-blue-400 mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Prêt à transformer votre entreprise ?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Contactez-nous pour discuter de vos besoins et découvrir comment
                nos solutions peuvent vous aider à atteindre vos objectifs.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-white/20">
              <Briefcase className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Consultation gratuite</h3>
              <p className="text-gray-300 mb-6">
                Bénéficiez d'une consultation initiale gratuite avec nos experts
                pour évaluer vos besoins et définir la meilleure stratégie.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
              >
                Planifier un appel
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewHome;
