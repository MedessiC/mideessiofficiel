import {
  ArrowRight, TrendingUp, Shield, Zap, Users, Award,
  CheckCircle, Building2, Heart, Lightbulb, HandHeart, Globe
} from 'lucide-react';
import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import { supabase, BlogPost } from '../lib/supabase';

const FeaturedPostSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="h-48 bg-gray-200 dark:bg-gray-700" />
    <div className="p-6 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
      </div>
    </div>
  </div>
);

const NewHome = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: '/hero1.png',
      badge: 'Mouvement d\'indépendance technologique',
      title: 'Nous sommes indépendants',
      description: 'MIDEESSI est un mouvement d\'indépendance technologique né au cœur du Bénin, héritier de l\'esprit du Dahomey.',
      subtitle: 'Nous concevons, fabriquons et innovons avec nos idées, notre savoir-faire et notre intelligence collective béninoise.'
    },
    {
      image: '/hero2.png',
      badge: 'Innovation 100% béninoise',
      title: 'Du terrain aux solutions',
      description: 'Chaque mois, nous nous immergeons dans un nouveau secteur pour créer des solutions adaptées aux réalités béninoises.',
      subtitle: 'De l\'agriculture au commerce, de l\'éducation à la santé, nous innovons là où le Bénin en a besoin.'
    },
    {
      image: '/hero3.jpg',
      badge: 'Souveraineté technologique',
      title: 'Consommons béninois',
      description: 'Nous refusons la dépendance technologique et bâtissons notre souveraineté numérique avec fierté.',
      subtitle: 'Chaque solution MIDEESSI est un acte d\'amour pour notre pays et notre continent africain.'
    }
  ];

  useEffect(() => {
    fetchBlogPosts();

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const { data: featured } = await supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, image_url, published_at')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(3);

      if (featured && featured.length > 0) {
        setFeaturedPosts(featured);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Motifs africains décoratifs en arrière-plan */}
      <div className="fixed inset-0 pointer-events-none opacity-5 dark:opacity-10 z-0">
        <div className="african-pattern"></div>
      </div>

      <SEO
        title="MIDEESSI - Mouvement d'indépendance technologique béninoise"
        description="MIDEESSI crée des solutions 100% béninoises ancrées dans le terrain. Du Dahomey au Bénin, nous bâtissons notre souveraineté technologique."
        keywords={['MIDEESSI', 'Bénin', 'innovation', 'technologie béninoise', 'souveraineté', 'Dahomey', 'Cotonou']}
      />

      {/* Hero Section avec diaporama amélioré */}
      <section className="relative text-white py-20 md:py-32 overflow-hidden">
        {/* Bordure dorée en haut */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#191970] via-[#ffd700] to-[#191970]"></div>
        
        {/* Motifs africains décoratifs */}
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-[#ffd700] opacity-20 rotate-45"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-[#ffd700] opacity-20 rounded-full"></div>
        
        {/* Diaporama d'images sans zoom */}
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="w-full h-full relative">
                <img
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#191970]/90 via-[#191970]/70 to-[#191970]/50"></div>
        </div>

        {/* Contenu principal avec transitions */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              {/* Accent doré décoratif */}
              <div className="absolute -left-4 top-0 w-1 h-32 bg-[#ffd700]"></div>
              
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 ease-in-out ${
                    index === currentSlide
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4 absolute'
                  }`}
                >
                  <div className="inline-block mb-4 px-4 py-2 bg-[#ffd700]/20 backdrop-blur-sm rounded-full border-2 border-[#ffd700]/40">
                    <span className="text-sm font-semibold text-[#ffd700]">{slide.badge}</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl text-gray-100 mb-4 leading-relaxed">
                    {slide.description}
                  </p>
                  <p className="text-lg text-gray-200 mb-8 leading-relaxed border-l-4 border-[#ffd700] pl-4">
                    {slide.subtitle}
                  </p>
                </div>
              ))}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#ffd700] text-[#191970] font-bold rounded-lg hover:bg-[#ffed4e] transition-all transform hover:scale-105 shadow-lg"
                >
                  Rejoignez le mouvement
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
                <a
                  href="/projects"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-[#ffd700] text-[#ffd700] font-bold rounded-lg hover:bg-[#ffd700]/10 backdrop-blur-sm transition-all"
                >
                  Nos créations
                </a>
              </div>

              {/* Indicateurs de slide avec style africain */}
              <div className="flex gap-3 mt-8">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'w-12 bg-[#ffd700]'
                        : 'w-6 bg-white/40 hover:bg-[#ffd700]/60'
                    }`}
                    aria-label={`Aller au slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section avec motifs africains */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-y-4 border-[#ffd700] transition-colors duration-300 relative">
        {/* Motifs décoratifs */}
        <div className="absolute top-4 left-4 w-16 h-16 border-2 border-[#191970] opacity-10 diamond-shape"></div>
        <div className="absolute bottom-4 right-4 w-20 h-20 border-2 border-[#ffd700] opacity-10 diamond-shape"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center transform hover:scale-105 transition-transform duration-300 relative"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="absolute inset-0 bg-[#ffd700]/5 rounded-lg transform rotate-3"></div>
                <div className="relative">
                  <div className="text-4xl md:text-5xl font-bold text-[#191970] dark:text-[#ffd700] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 relative">
            <div className="inline-block mb-4">
              <div className="h-1 w-20 bg-[#ffd700] mx-auto mb-4"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#191970] dark:text-white mb-4">
                Notre méthodologie d'innovation
              </h2>
              <div className="h-1 w-20 bg-[#ffd700] mx-auto"></div>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Chaque mois, nous sélectionnons un secteur et nous immergeons sur le terrain pour créer des solutions adaptées aux besoins réels
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#ffd700] transform hover:-translate-y-2 relative overflow-hidden group"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#ffd700]/5 transform rotate-45 translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="w-14 h-14 bg-[#191970] rounded-lg flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative z-10">
                  <service.icon className="w-7 h-7 text-[#ffd700]" />
                </div>
                <h3 className="text-xl font-bold text-[#191970] dark:text-white mb-3 relative z-10">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 relative z-10">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors duration-300 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -left-8 top-0 w-2 h-full bg-gradient-to-b from-[#ffd700] to-transparent hidden lg:block"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#191970] dark:text-white mb-6">
                Nos valeurs cardinales
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                MIDEESSI est guidé par des valeurs profondes qui façonnent chaque solution que nous créons et chaque action que nous entreprenons.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-3 transform hover:translate-x-2 transition-transform duration-300 bg-white dark:bg-gray-800 p-3 rounded-lg border-l-4 border-[#ffd700]"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <CheckCircle className="w-5 h-5 text-[#ffd700] flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-200 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#191970] dark:bg-gray-800 p-8 rounded-lg text-white shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-[#ffd700] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#ffd700]/10 rounded-full -translate-y-20 translate-x-20"></div>
              <Heart className="w-12 h-12 text-[#ffd700] mb-4 relative z-10" />
              <h3 className="text-2xl font-bold mb-4 relative z-10">Consommons 100% béninois</h3>
              <p className="text-gray-200 mb-6 relative z-10">
                Chaque solution MIDEESSI est un acte d'amour pour notre pays. Nous refusons la dépendance technologique et œuvrons pour la souveraineté numérique béninoise et africaine. Du Dahomey au Bénin, l'esprit d'indépendance perdure.
              </p>
              <a
                href="/about"
                className="inline-flex items-center text-[#ffd700] hover:text-[#ffed4e] font-semibold group relative z-10"
              >
                Découvrir notre manifeste
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/bg-process.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[#191970]/80 dark:bg-black/80 z-0 transition-colors duration-300"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#ffd700]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Notre processus mensuel
            </h2>
            <div className="h-1 w-24 bg-[#ffd700] mx-auto mb-4"></div>
            <p className="text-lg text-gray-200 max-w-3xl mx-auto">
              De l'immersion terrain au déploiement, nous suivons une méthodologie rigoureuse ancrée dans les réalités béninoises
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: '1',
                title: 'Immersion',
                desc: 'Rencontre avec les acteurs du secteur ciblé',
                img: '/immersion.jpg',
              },
              {
                step: '2',
                title: 'Collecte',
                desc: 'Écoute des besoins et des défis quotidiens',
                img: '/collecte.jpg',
              },
              {
                step: '3',
                title: 'Conception',
                desc: 'Développement de solutions adaptées',
                img: '/images/conception.jpg',
              },
              {
                step: '4',
                title: 'Tests',
                desc: 'Validation sur le terrain avec les utilisateurs',
                img: '/images/tests.jpg',
              },
              {
                step: '5',
                title: 'Déploiement',
                desc: 'Accompagnement et formation continue',
                img: '/images/deploiement.jpg',
              },
            ].map((item, index) => (
              <div 
                key={index} 
                className="relative group transition-all duration-300 hover:-translate-y-2"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="overflow-hidden rounded-lg shadow-2xl border-2 border-[#ffd700]">
                  <div className="relative h-40 overflow-hidden bg-gray-200">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <div className="absolute top-2 left-2 w-10 h-10 bg-[#ffd700] text-[#191970] font-bold rounded-full flex items-center justify-center text-lg shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  <div className="p-6 bg-white dark:bg-gray-800 transition-colors duration-300">
                    <h3 className="text-lg font-bold text-[#191970] dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{item.desc}</p>
                  </div>
                </div>
                {index < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
                    <ArrowRight className="w-6 h-6 text-[#ffd700] drop-shadow-lg" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {(loading || featuredPosts.length > 0) && (
        <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
              <div>
                <div className="h-1 w-16 bg-[#ffd700] mb-4"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#191970] dark:text-white mb-4">
                  Articles à la une
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Nos dernières réflexions et actualités du mouvement
                </p>
              </div>
              <a
                href="/blog"
                className="hidden md:inline-flex items-center text-[#191970] hover:text-[#ffd700] font-semibold group"
              >
                Voir tous les articles
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {loading ? (
                <>
                  <FeaturedPostSkeleton />
                  <FeaturedPostSkeleton />
                  <FeaturedPostSkeleton />
                </>
              ) : (
                featuredPosts.map((post, index) => (
                  <a
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white dark:bg-gray-900 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 hover:border-[#ffd700] transform hover:-translate-y-2"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-[#ffd700] text-[#191970] text-xs font-bold rounded-full shadow-lg">
                          À la une
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                        {new Date(post.published_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <h3 className="text-xl font-bold text-[#191970] dark:text-white mb-2 group-hover:text-[#ffd700] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                      <span className="inline-flex items-center text-[#191970] dark:text-[#ffd700] font-semibold text-sm group-hover:gap-2 transition-all">
                        Lire l'article
                        <ArrowRight className="ml-1 w-3 h-3" />
                      </span>
                    </div>
                  </a>
                ))
              )}
            </div>
            <div className="md:hidden text-center">
              <a
                href="/blog"
                className="inline-flex items-center text-[#191970] hover:text-[#ffd700] font-semibold group"
              >
                Voir tous les articles
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-[#191970] dark:bg-gray-900 text-white transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-32 h-32 border-4 border-[#ffd700] rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 border-4 border-[#ffd700] diamond-shape"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Globe className="w-16 h-16 text-[#ffd700] mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pour le Bénin. Pour l'Afrique. Pour le monde.
              </h2>
              <p className="text-xl text-gray-200 mb-8">
                Rejoignez le mouvement d'indépendance technologique. Ensemble, bâtissons un avenir où chaque jeune béninois peut vivre dignement de son talent.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border-2 border-[#ffd700] shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffd700]/10 rounded-full -translate-y-16 translate-x-16"></div>
              <Building2 className="w-12 h-12 text-[#ffd700] mb-4 relative z-10" />
              <h3 className="text-2xl font-bold mb-4 relative z-10">Notre appel</h3>
              <p className="text-gray-200 mb-6 relative z-10">
                Que vous soyez jeune béninois, entrepreneur local, membre de la diaspora ou partenaire africain, vous avez votre place dans ce mouvement. Créons ensemble l'excellence béninoise.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center w-full px-8 py-4 bg-[#ffd700] hover:bg-[#ffed4e] text-[#191970] font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg relative z-10"
              >
                Contactez-nous
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 bg-gradient-to-r from-[#191970] via-[#ffd700] to-[#191970] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="african-pattern-quote"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-2xl md:text-3xl font-bold mb-2 text-[#191970]">
            « Du Dahomey au Bénin, l'esprit d'indépendance perdure. »
          </p>
          <p className="text-lg text-[#191970] font-semibold">
            MIDEESSI - Fondé en 2025, Cotonou, République du Bénin
          </p>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .diamond-shape {
          transform: rotate(45deg);
        }

        /* Motifs africains en arrière-plan */
        .african-pattern {
          background-image: 
            repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(25, 25, 112, 0.1) 35px, rgba(25, 25, 112, 0.1) 70px),
            repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255, 215, 0, 0.1) 35px, rgba(255, 215, 0, 0.1) 70px);
          width: 100%;
          height: 100%;
        }

        .african-pattern-quote {
          background-image: 
            repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(25, 25, 112, 0.2) 20px, rgba(25, 25, 112, 0.2) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(25, 25, 112, 0.2) 20px, rgba(25, 25, 112, 0.2) 40px);
          width: 100%;
          height: 100%;
        }

        /* Correction du zoom sur mobile */
        @media (max-width: 768px) {
          img {
            max-width: 100%;
            height: auto;
          }
          
          .object-cover {
            object-fit: cover !important;
          }
        }

        @media (max-width: 640px) {
          .text-4xl {
            font-size: 2rem;
          }
          .text-5xl {
            font-size: 2.5rem;
          }
          .text-6xl {
            font-size: 3rem;
          }
        }

        /* Animations des bordures dorées */
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .border-shimmer {
          background: linear-gradient(90deg, #191970 0%, #ffd700 50%, #191970 100%);
          background-size: 2000px 100%;
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NewHome;