import {
  ArrowRight, TrendingUp, Shield, Zap, Users, Award,
  CheckCircle, Building2, Heart, Lightbulb, HandHeart, Globe, ChevronLeft, ChevronRight, ChevronUp,
  BookOpen, Download, Star, Calendar, Clock, Target, Filter, Search, ExternalLink
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

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

const PDFSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="h-64 bg-gray-200 dark:bg-gray-700" />
    <div className="p-6 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      </div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  </div>
);

const NewHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [weeklyPDF, setWeeklyPDF] = useState(null);
  const [loadingPDF, setLoadingPDF] = useState(true);

  // Initialize Supabase
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || '',
    import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  );

  const heroSlides = [
    {
      image: '/hero1.webp',
      badge: 'Mouvement d\'indépendance technologique',
      title: 'Nous sommes indépendants',
      description: 'MIDEESSI est un mouvement d\'indépendance technologique né au cœur du Bénin, héritier de l\'esprit du Dahomey.',
      subtitle: 'Nous concevons, fabriquons et innovons avec nos idées, notre savoir-faire et notre intelligence collective béninoise.'
    },
    {
      image: '/hero2.webp',
      badge: 'Innovation 100% béninoise',
      title: 'Du terrain aux solutions',
      description: 'Chaque trimestre, nous nous immergeons dans un nouveau secteur pour créer des solutions adaptées aux réalités béninoises.',
      subtitle: 'De l\'agriculture au commerce, de l\'éducation à la santé, nous innovons là où le Bénin en a besoin.'
    },
    {
      image: '/hero3.webp',
      badge: 'Souveraineté technologique',
      title: 'Consommons béninois',
      description: 'Nous refusons la dépendance technologique et bâtissons notre souveraineté numérique avec fierté.',
      subtitle: 'Chaque solution MIDEESSI est un acte d\'amour pour notre pays et notre continent africain.'
    }
  ];

  useEffect(() => {
    fetchBlogPosts();
    fetchWeeklyPDF();

    const heroInterval = setInterval(() => {
      if (!isPaused) {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }
    }, 7000);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(heroInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isPaused]);

  const fetchBlogPosts = async () => {
    try {
      setLoadingPosts(true);
      const { data: featured, error } = await supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, image_url, published_at')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Erreur lors du chargement des articles:', error);
      } else if (featured && featured.length > 0) {
        setFeaturedPosts(featured);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchWeeklyPDF = async () => {
    try {
      setLoadingPDF(true);
      const { data: weekly, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Erreur lors du chargement du PDF:', error);
      } else if (weekly) {
        setWeeklyPDF(weekly);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du PDF:', error);
    } finally {
      setLoadingPDF(false);
    }
  };

  const nextSlide = () => {
    setIsPaused(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setTimeout(() => setIsPaused(false), 15000);
  };

  const prevSlide = () => {
    setIsPaused(true);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setTimeout(() => setIsPaused(false), 15000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const stats = [
    { value: 1, label: 'Secteur par trimestre', icon: TrendingUp },
    { value: 100, label: 'Béninois', suffix: '%', icon: Award },
    { value: 5, label: 'Étapes terrain', icon: Shield },
    { value: 2025, label: 'Année de fondation', icon: Building2 },
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
    <div className="min-h-screen bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none opacity-[0.15] dark:opacity-20 z-0">
        <div className="african-pattern"></div>
      </div>

      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-4 bg-[#ffd700] text-[#191970] rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[#ffd700]/50 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
        }`}
        aria-label="Retour en haut de la page"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      {/* Hero Section */}
      <section className="relative text-white py-16 sm:py-20 md:py-32 overflow-hidden" role="banner">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#191970] via-[#ffd700] to-[#191970]"></div>
        
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-[#ffd700] opacity-20 rotate-45 animate-pulse hidden sm:block"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-[#ffd700] opacity-20 rounded-full animate-pulse hidden sm:block" style={{ animationDelay: '1s' }}></div>
        
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt=""
                loading={index === 0 ? "eager" : "lazy"}
                className="absolute inset-0 w-full h-full object-cover object-center"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#191970]/95 via-[#191970]/80 to-[#191970]/60"></div>
        </div>

        <button
          onClick={prevSlide}
          onKeyDown={(e) => handleKeyDown(e, prevSlide)}
          className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-[#ffd700]/30 hover:bg-[#ffd700]/50 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-full transition-all duration-300 border-2 border-[#ffd700] focus:outline-none focus:ring-4 focus:ring-[#ffd700]/50"
          aria-label="Diapositive précédente"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          onKeyDown={(e) => handleKeyDown(e, nextSlide)}
          className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-[#ffd700]/30 hover:bg-[#ffd700]/50 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-full transition-all duration-300 border-2 border-[#ffd700] focus:outline-none focus:ring-4 focus:ring-[#ffd700]/50"
          aria-label="Diapositive suivante"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
        </button>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-32 bg-[#ffd700] hidden sm:block"></div>
              
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 ease-in-out ${
                    index === currentSlide
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4 absolute'
                  }`}
                  aria-hidden={index !== currentSlide}
                >
                  <div className="inline-block mb-4 px-3 sm:px-4 py-2 bg-[#ffd700]/20 backdrop-blur-sm rounded-full border-2 border-[#ffd700]/40">
                    <span className="text-xs sm:text-sm font-semibold text-[#ffd700]">{slide.badge}</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-3 sm:mb-4 leading-relaxed">
                    {slide.description}
                  </p>
                  <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 sm:mb-8 leading-relaxed border-l-4 border-[#ffd700] pl-4">
                    {slide.subtitle}
                  </p>
                </div>
              ))}
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href="/learn"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#ffd700] text-[#191970] font-bold rounded-lg hover:bg-[#ffed4e] transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#ffd700]/50 text-sm sm:text-base"
                >
                  MIDEESSI Learn
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a
                  href="/projects"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-[#ffd700] text-[#ffd700] font-bold rounded-lg hover:bg-[#ffd700]/10 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#ffd700]/50 text-sm sm:text-base"
                >
                  Nos projets
                </a>
              </div>

              <div className="flex gap-2 mt-6 sm:mt-8" role="tablist" aria-label="Sélection de diapositive">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSlide(index);
                      setIsPaused(true);
                      setTimeout(() => setIsPaused(false), 15000);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ffd700] ${
                      index === currentSlide
                        ? 'w-12 bg-[#ffd700]'
                        : 'w-6 bg-white/40 hover:bg-[#ffd700]/60'
                    }`}
                    role="tab"
                    aria-label={`Aller à la diapositive ${index + 1}`}
                    aria-selected={index === currentSlide}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-y-4 border-[#ffd700] transition-colors duration-300 relative">
        <div className="absolute top-4 left-4 w-16 h-16 border-2 border-[#191970] opacity-10 diamond-shape hidden sm:block"></div>
        <div className="absolute bottom-4 right-4 w-20 h-20 border-2 border-[#ffd700] opacity-10 diamond-shape hidden sm:block"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center transform hover:scale-105 transition-transform duration-300 relative group"
              >
                <div className="absolute inset-0 bg-[#ffd700]/5 rounded-lg transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                <div className="relative">
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-[#191970] dark:text-[#ffd700] opacity-50" />
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#191970] dark:text-[#ffd700] mb-2">
                    {stat.value}{stat.suffix && stat.suffix}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly PDF Section */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="h-1 w-16 bg-[#ffd700] mx-auto mb-4"></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#191970] dark:text-white mb-4">
              Le PDF de la semaine
            </h2>
            <div className="h-1 w-16 bg-[#ffd700] mx-auto"></div>
          </div>

          {loadingPDF ? (
            <PDFSkeleton />
          ) : weeklyPDF ? (
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden border-2 border-[#ffd700] shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 p-6 sm:p-8 md:p-12">
                <div className="md:col-span-1 flex items-center justify-center">
                  <div className="w-full aspect-square bg-gradient-to-br from-[#191970] to-[#ffd700] rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                    {weeklyPDF.cover_image ? (
                      <img 
                        src={weeklyPDF.cover_image} 
                        alt={weeklyPDF.title} 
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <BookOpen className={`${weeklyPDF.cover_image ? 'hidden' : 'flex'} w-20 h-20 sm:w-24 sm:h-24 text-white opacity-90`} />
                  </div>
                </div>
                <div className="md:col-span-2 flex flex-col justify-between">
                  <div>
                    <div className="inline-block mb-4 px-3 py-1 bg-[#ffd700] text-[#191970] text-xs sm:text-sm font-bold rounded-full">
                      ✨ Nouvelle semaine
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#191970] dark:text-white mb-3 sm:mb-4">
                      {weeklyPDF.title}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                      {weeklyPDF.description}
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                      <div className="bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 md:p-4 rounded-lg">
                        <div className="flex items-center gap-1 mb-1 justify-center sm:justify-start">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-[#ffd700] fill-[#ffd700]" />
                          <span className="font-bold text-xs sm:text-sm">{weeklyPDF.rating || 0}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Note</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 md:p-4 rounded-lg">
                        <div className="flex items-center gap-1 mb-1 justify-center sm:justify-start">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                          <span className="font-bold text-xs sm:text-sm">{weeklyPDF.students || 0}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Étudiants</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-2 sm:p-3 md:p-4 rounded-lg">
                        <div className="flex items-center gap-1 mb-1 justify-center sm:justify-start">
                          <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                          <span className="font-bold text-xs sm:text-sm">{weeklyPDF.pages || 50}p</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Pages</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    {weeklyPDF.article_url && (
                      <a
                        href={weeklyPDF.article_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-all text-xs sm:text-base"
                      >
                        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Lire l'article</span>
                        <span className="sm:hidden">Article</span>
                      </a>
                    )}
                    {weeklyPDF.buy_url && (
                      <a
                        href={weeklyPDF.buy_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#ffd700] hover:bg-[#ffed4e] text-[#191970] font-bold rounded-lg transition-all shadow-lg text-xs sm:text-base"
                      >
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{weeklyPDF.price || 1000} FCFA - Acheter</span>
                        <span className="sm:hidden">Acheter</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Le prochain PDF arrive très prochainement !
              </p>
            </div>
          )}
        </div>
      </section>

      {/* MIDEESSI Learn Highlight Section */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative">
              <div className="absolute -left-8 top-0 w-2 h-full bg-gradient-to-b from-[#ffd700] to-transparent hidden lg:block"></div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#191970] dark:text-white mb-4 sm:mb-6">
                MIDEESSI Learn - Apprendre en ligne
              </h2>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                Des PDFs de qualité, conçus pour votre téléphone. Chaque semaine, de nouveaux contenus pratiques et accessibles, créés par des experts béninois.
              </p>
              <div className="space-y-3 sm:space-y-4 mb-8">
                <div className="flex items-start space-x-3 bg-white dark:bg-gray-900 p-4 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-[#ffd700] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">Nouveau PDF chaque semaine</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Contenus progressifs de débutant à avancé</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white dark:bg-gray-900 p-4 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-[#ffd700] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">100% mobile optimisé</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Apprenez où vous voulez, quand vous voulez</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white dark:bg-gray-900 p-4 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-[#ffd700] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-sm sm:text-base">Prix unique : 1000 FCFA/PDF</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Accès illimité après achat</p>
                  </div>
                </div>
              </div>
              <a
                href="/learn"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-[#ffd700] text-[#191970] font-bold rounded-lg hover:bg-[#ffed4e] transition-all duration-300 transform hover:scale-[1.02] shadow-lg focus:outline-none focus:ring-4 focus:ring-[#ffd700]/50 text-sm sm:text-base"
              >
                Voir les PDFs disponibles
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
            <div className="bg-[#191970] dark:bg-gray-900 p-6 sm:p-8 rounded-lg text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border-4 border-[#ffd700] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#ffd700]/10 rounded-full -translate-y-20 translate-x-20"></div>
              <BookOpen className="w-12 h-12 text-[#ffd700] mb-4 relative z-10" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 relative z-10">Qu'est-ce que MIDEESSI Learn ?</h3>
              <p className="text-sm sm:text-base text-gray-200 mb-4 sm:mb-6 relative z-10 leading-relaxed">
                Une plateforme d'apprentissage créée par MIDEESSI pour partager le savoir-faire technologique béninois. Chaque PDF est une occasion d'apprendre les compétences en demande.
              </p>
              <ul className="space-y-2 sm:space-y-3 relative z-10 text-sm sm:text-base">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#ffd700] rounded-full"></span>
                  Créé par des experts locaux
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#ffd700] rounded-full"></span>
                  Contenu pratique et applicable
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#ffd700] rounded-full"></span>
                  Accessible à tous les niveaux
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900 transition-colors duration-300 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4">
              <div className="h-1 w-20 bg-[#ffd700] mx-auto mb-4"></div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#191970] dark:text-white mb-4">
                Notre méthodologie d'innovation
              </h2>
              <div className="h-1 w-20 bg-[#ffd700] mx-auto"></div>
            </div>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Chaque trimestre, nous nous immergeons sur le terrain pour créer des solutions adaptées aux besoins réels
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-6 sm:p-8 rounded-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#ffd700] transform hover:-translate-y-2 relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#ffd700]/5 transform rotate-45 translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="w-14 h-14 bg-[#191970] rounded-lg flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative z-10">
                  <service.icon className="w-7 h-7 text-[#ffd700]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#191970] dark:text-white mb-3 relative z-10">
                  {service.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base relative z-10 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative">
              <div className="absolute -left-8 top-0 w-2 h-full bg-gradient-to-b from-[#ffd700] to-transparent hidden lg:block"></div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#191970] dark:text-white mb-4 sm:mb-6">
                Nos valeurs cardinales
              </h2>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                MIDEESSI est guidé par des valeurs profondes qui façonnent chaque solution que nous créons.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {values.map((value, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-3 transform hover:translate-x-2 transition-all duration-300 bg-white dark:bg-gray-900 p-3 rounded-lg border-l-4 border-[#ffd700] hover:shadow-md"
                  >
                    <CheckCircle className="w-5 h-5 text-[#ffd700] flex-shrink-0" />
                    <span className="text-gray-800 dark:text-gray-200 font-medium text-sm sm:text-base">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#191970] dark:bg-gray-900 p-6 sm:p-8 rounded-lg text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border-4 border-[#ffd700] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#ffd700]/10 rounded-full -translate-y-20 translate-x-20"></div>
              <Heart className="w-12 h-12 text-[#ffd700] mb-4 relative z-10" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 relative z-10">Consommons 100% béninois</h3>
              <p className="text-sm sm:text-base text-gray-200 mb-6 relative z-10 leading-relaxed">
                Chaque solution MIDEESSI est un acte d'amour pour notre pays. Nous refusons la dépendance technologique et œuvrons pour la souveraineté numérique béninoise et africaine.
              </p>
              <a
                href="/about"
                className="inline-flex items-center text-[#ffd700] hover:text-[#ffed4e] font-semibold group relative z-10 focus:outline-none focus:underline text-sm sm:text-base"
              >
                Découvrir notre manifeste
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section
        className="py-16 sm:py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('/images/bg-process.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[#191970]/85 dark:bg-black/85 z-0 transition-colors duration-300"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#ffd700]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Notre processus Trimestriel
            </h2>
            <div className="h-1 w-24 bg-[#ffd700] mx-auto mb-4"></div>
            <p className="text-base sm:text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed px-4">
              De l'immersion terrain au déploiement, une méthodologie rigoureuse ancrée dans les réalités béninoises
            </p>
          </div>

          <div className="hidden md:grid md:grid-cols-5 gap-4 lg:gap-6">
            {[
              {
                step: '1',
                title: 'Immersion',
                desc: 'Rencontre avec les acteurs du secteur ciblé',
              },
              {
                step: '2',
                title: 'Collecte',
                desc: 'Écoute des besoins et des défis quotidiens',
              },
              {
                step: '3',
                title: 'Conception',
                desc: 'Développement de solutions adaptées',
              },
              {
                step: '4',
                title: 'Tests',
                desc: 'Validation sur le terrain avec les utilisateurs',
              },
              {
                step: '5',
                title: 'Déploiement',
                desc: 'Accompagnement et formation continue',
              },
            ].map((item, index) => (
              <div 
                key={index} 
                className="relative group transition-all duration-300 hover:-translate-y-2"
              >
                <div className="overflow-hidden rounded-lg shadow-2xl border-2 border-[#ffd700]">
                  <div className="relative h-32 sm:h-40 overflow-hidden bg-gray-200">
                    <div className="w-full h-full bg-gradient-to-br from-[#191970] to-[#ffd700] flex items-center justify-center">
                      <span className="text-4xl sm:text-6xl font-bold text-white opacity-20">{item.step}</span>
                    </div>
                    <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 bg-[#ffd700] text-[#191970] font-bold rounded-full flex items-center justify-center text-sm sm:text-lg shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 transition-colors duration-300">
                    <h3 className="text-base sm:text-lg font-bold text-[#191970] dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                {index < 4 && (
                  <div className="absolute top-1/2 -right-2 lg:-right-3 transform -translate-y-1/2 z-20 hidden sm:block">
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#ffd700] drop-shadow-lg" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="md:hidden space-y-6 sm:space-y-8">
            {[
              {
                step: '1',
                title: 'Immersion',
                desc: 'Rencontre avec les acteurs du secteur ciblé',
              },
              {
                step: '2',
                title: 'Collecte',
                desc: 'Écoute des besoins et des défis quotidiens',
              },
              {
                step: '3',
                title: 'Conception',
                desc: 'Développement de solutions adaptées',
              },
              {
                step: '4',
                title: 'Tests',
                desc: 'Validation sur le terrain avec les utilisateurs',
              },
              {
                step: '5',
                title: 'Déploiement',
                desc: 'Accompagnement et formation continue',
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                {index < 4 && (
                  <div className="absolute left-6 top-16 w-0.5 h-12 bg-[#ffd700]/40 z-0"></div>
                )}
                
                <div className="flex gap-3 sm:gap-4 items-start relative z-10">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#ffd700] text-[#191970] font-bold rounded-full flex items-center justify-center text-lg shadow-lg border-4 border-white dark:border-gray-800">
                      {item.step}
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border-2 border-[#ffd700]/40 overflow-hidden">
                    <div className="p-4 sm:p-5">
                      <h3 className="text-base sm:text-lg font-bold text-[#191970] dark:text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-4">
            <div>
              <div className="h-1 w-16 bg-[#ffd700] mb-4"></div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#191970] dark:text-white mb-4">
                Derniers articles
              </h2>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Insights et actualités du mouvement MIDEESSI
              </p>
            </div>
            <a
              href="/blog"
              className="hidden md:inline-flex items-center text-[#191970] hover:text-[#ffd700] font-semibold group transition-colors duration-300 focus:outline-none focus:underline text-sm sm:text-base"
            >
              Voir tous les articles
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
            {loadingPosts ? (
              <>
                <FeaturedPostSkeleton />
                <FeaturedPostSkeleton />
                <FeaturedPostSkeleton />
              </>
            ) : featuredPosts.length > 0 ? (
              featuredPosts.slice(0, 3).map((post) => (
                <a
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 hover:border-[#ffd700] transform hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-[#ffd700]/50"
                >
                  <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23191970" width="400" height="300"/%3E%3Ctext fill="%23ffd700" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EArticle%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 sm:px-3 py-1 bg-[#ffd700] text-[#191970] text-xs font-bold rounded-full shadow-lg">
                        Article
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                      {new Date(post.published_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#191970] dark:text-white mb-2 group-hover:text-[#ffd700] transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm line-clamp-2 mb-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center text-[#191970] dark:text-[#ffd700] font-semibold text-xs sm:text-sm group-hover:gap-2 transition-all duration-300">
                      Lire l'article
                      <ArrowRight className="ml-1 w-3 h-3" />
                    </span>
                  </div>
                </a>
              ))
            ) : (
              <div className="col-span-1 md:col-span-3 text-center py-8 sm:py-12">
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-lg">
                  Aucun article pour le moment. Restez connectés pour nos prochaines publications.
                </p>
              </div>
            )}
          </div>
          <div className="md:hidden text-center">
            <a
              href="/blog"
              className="inline-flex items-center text-[#191970] hover:text-[#ffd700] font-semibold group transition-colors duration-300 text-sm sm:text-base"
            >
              Voir tous les articles
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-[#191970] dark:bg-gray-900 text-white transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-32 h-32 border-4 border-[#ffd700] rounded-full animate-pulse hidden sm:block"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 border-4 border-[#ffd700] diamond-shape animate-pulse hidden sm:block" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <Globe className="w-12 h-12 sm:w-16 sm:h-16 text-[#ffd700] mb-4 sm:mb-6" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Rejoignez le mouvement
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 leading-relaxed">
                Explorez nos PDFs, lisez nos articles et participez à la construction de la souveraineté technologique béninoise.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 sm:p-8 rounded-lg border-2 border-[#ffd700] shadow-2xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffd700]/10 rounded-full -translate-y-16 translate-x-16"></div>
              <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-[#ffd700] mb-3 sm:mb-4 relative z-10" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 relative z-10">Commencez maintenant</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-200 mb-6 relative z-10 leading-relaxed">
                Accédez à notre plateforme d'apprentissage et découvrez les formations disponibles.
              </p>
              <a
                href="/learn"
                className="inline-flex items-center justify-center w-full px-6 sm:px-8 py-3 sm:py-4 bg-[#ffd700] hover:bg-[#ffed4e] text-[#191970] font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg relative z-10 focus:outline-none focus:ring-4 focus:ring-[#ffd700]/50 text-sm sm:text-base"
              >
                MIDEESSI Learn
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-[#191970] via-[#ffd700] to-[#191970] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="african-pattern-quote"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-[#191970]">
            « Du Dahomey au Bénin, l'esprit d'indépendance perdure. »
          </p>
          <p className="text-sm sm:text-base md:text-lg text-[#191970] font-semibold">
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

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover,
        .pause-animation {
          animation-play-state: paused;
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

        .african-pattern {
          background-image: 
            repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(25, 25, 112, 0.15) 35px, rgba(25, 25, 112, 0.15) 70px),
            repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255, 215, 0, 0.15) 35px, rgba(255, 215, 0, 0.15) 70px);
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
            line-height: 1.2;
          }
          .text-5xl {
            font-size: 2.5rem;
            line-height: 1.2;
          }
          .text-6xl {
            font-size: 3rem;
            line-height: 1.2;
          }
        }

        * {
          transition-property: color, background-color, border-color;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default NewHome;