import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Zap, Users, Award, CheckCircle, Building2, Heart, Lightbulb, HandHeart, Globe } from 'lucide-react';
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
    { value: '1', label: 'Secteur par mois' },
    { value: '100%', label: 'Béninois' },
    { value: '5', label: 'Étapes terrain' },
    { value: '2025', label: 'Année de fondation' },
  ];

  const services = [
    {
      icon: Users,
      title: 'Immersion terrain',
      description: 'Nous allons à la rencontre des acteurs : agriculteurs, commerçants, enseignants, pour comprendre leurs réalités quotidiennes.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation locale',
      description: 'Nous concevons des solutions numériques et matérielles adaptées aux besoins réels du Bénin.',
    },
    {
      icon: Shield,
      title: 'Tests sur le terrain',
      description: 'Nos laboratoires sont les rues de Cotonou, les marchés de Porto-Novo, les champs de Parakou.',
    },
    {
      icon: HandHeart,
      title: 'Accompagnement',
      description: 'Nous déployons nos solutions avec formation, suivi et support continu pour garantir leur appropriation.',
    },
  ];

  const values = [
    'Patriotisme béninois',
    'Apprentissage continu',
    'Innovation de terrain',
    'Solidarité collective',
    'Souveraineté technologique',
    'Excellence locale',
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="MIDEESSI - Mouvement d'indépendance technologique béninoise"
        description="MIDEESSI crée des solutions 100% béninoises ancrées dans le terrain. Du Dahomey au Bénin, nous bâtissons notre souveraineté technologique."
        keywords={['MIDEESSI', 'Bénin', 'innovation', 'technologie béninoise', 'souveraineté', 'Dahomey', 'Cotonou']}
      />

      <section className="relative bg-gradient-to-br from-midnight via-navy to-steel text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-blue-600/20 rounded-full border border-blue-400/30">
                <span className="text-sm font-semibold">Mouvement d'indépendance technologique</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Nous sommes indépendants
              </h1>
              <p className="text-xl text-gray-200 mb-4 leading-relaxed">
                MIDEESSI est un mouvement d'indépendance technologique né au cœur du Bénin, héritier de l'esprit du Dahomey.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Nous concevons, fabriquons et innovons avec nos idées, notre savoir-faire et notre intelligence collective béninoise.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-midnight font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  Rejoignez le mouvement
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all"
                >
                  Nos créations
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
              <img
                src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Innovation technologique béninoise"
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
              Notre méthodologie d'innovation
            </h2>
            <p className="text-lg text-corporate-600 dark:text-corporate-300 max-w-3xl mx-auto">
              Chaque mois, nous sélectionnons un secteur et nous immergeons sur le terrain pour créer des solutions adaptées aux besoins réels
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
                Nos valeurs cardinales
              </h2>
              <p className="text-lg text-corporate-600 dark:text-corporate-300 mb-8">
                MIDEESSI est guidé par des valeurs profondes qui façonnent chaque solution que nous créons et chaque action que nous entreprenons.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-corporate-700 dark:text-corporate-200">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-midnight dark:bg-corporate-800 p-8 rounded-lg text-white">
              <Heart className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Consommons 100% béninois</h3>
              <p className="text-gray-300 mb-6">
                Chaque solution MIDEESSI est un acte d'amour pour notre pays. Nous refusons la dépendance technologique et œuvrons pour la souveraineté numérique béninoise et africaine. Du Dahomey au Bénin, l'esprit d'indépendance perdure.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold"
              >
                Découvrir notre manifeste
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-midnight dark:text-white mb-4">
              Notre processus mensuel
            </h2>
            <p className="text-lg text-corporate-600 dark:text-corporate-300 max-w-3xl mx-auto">
              De l'immersion terrain au déploiement, nous suivons une méthodologie rigoureuse ancrée dans les réalités béninoises
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: '1', title: 'Immersion', desc: 'Rencontre avec les acteurs du secteur ciblé' },
              { step: '2', title: 'Collecte', desc: 'Écoute des besoins et des défis quotidiens' },
              { step: '3', title: 'Conception', desc: 'Développement de solutions adaptées' },
              { step: '4', title: 'Tests', desc: 'Validation sur le terrain avec les utilisateurs' },
              { step: '5', title: 'Déploiement', desc: 'Accompagnement et formation continue' },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-corporate-50 dark:bg-gray-800 p-6 rounded-lg border border-corporate-200 dark:border-gray-700">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-midnight dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-corporate-600 dark:text-corporate-300">
                    {item.desc}
                  </p>
                </div>
                {index < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-blue-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {featuredPosts.length > 0 && (
        <section className="py-20 bg-corporate-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-midnight dark:text-white mb-4">
                  Articles à la une
                </h2>
                <p className="text-lg text-corporate-600 dark:text-corporate-300">
                  Nos dernières réflexions et actualités du mouvement
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
                  className="group bg-white dark:bg-gray-900 rounded-lg overflow-hidden hover:shadow-xl transition-all border border-corporate-200 dark:border-gray-700"
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
      )}

      <section className="py-20 bg-midnight dark:bg-corporate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Globe className="w-16 h-16 text-blue-400 mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pour le Bénin. Pour l'Afrique. Pour le monde.
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Rejoignez le mouvement d'indépendance technologique. Ensemble, bâtissons un avenir où chaque jeune béninois peut vivre dignement de son talent.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-white/20">
              <Building2 className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Notre appel</h3>
              <p className="text-gray-300 mb-6">
                Que vous soyez jeune béninois, entrepreneur local, membre de la diaspora ou partenaire africain, vous avez votre place dans ce mouvement. Créons ensemble l'excellence béninoise.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
              >
                Contactez-nous
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-2xl font-bold mb-2">
            « Du Dahomey au Bénin, l'esprit d'indépendance perdure. »
          </p>
          <p className="text-lg">
            MIDEESSI SARL-U - Fondé en 2025, Cotonou, République du Bénin
          </p>
        </div>
      </section>
    </div>
  );
};

export default NewHome;