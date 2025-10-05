import {
  ArrowRight, TrendingUp, Shield, Zap, Users, Award,
  CheckCircle, Building2, Heart, Lightbulb, HandHeart, Globe, ChevronLeft, ChevronRight, ChevronUp
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
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

const CounterAnimation = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <div ref={ref}>{count}</div>;
};

const NewHome = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

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
      image: '/hero3.png',
      badge: 'Souveraineté technologique',
      title: 'Consommons béninois',
      description: 'Nous refusons la dépendance technologique et bâtissons notre souveraineté numérique avec fierté.',
      subtitle: 'Chaque solution MIDEESSI est un acte d\'amour pour notre pays et notre continent africain.'
    }
  ];

  const testimonials = [
    {
      quote: "MIDEESSI transforme véritablement nos secteurs avec des solutions adaptées à nos réalités.",
      author: "Amadou K.",
      role: "Entrepreneur agricole, Parakou"
    },
    {
      quote: "Un mouvement qui redonne espoir à la jeunesse béninoise. L'innovation locale est notre avenir.",
      author: "Fatoumata S.",
      role: "Développeuse, Cotonou"
    },
    {
      quote: "Fiers de voir des solutions 100% béninoises qui répondent à nos besoins quotidiens.",
      author: "Ibrahim D.",
      role: "Commerçant, Porto-Novo"
    }
  ];

  const partners = [
    { name: "Partenaire 1", logo: "/logos/partner1.png" },
    { name: "Partenaire 2", logo: "/logos/partner2.png" },
    { name: "Partenaire 3", logo: "/logos/partner3.png" },
    { name: "Partenaire 4", logo: "/logos/partner4.png" },
    { name: "Partenaire 5", logo: "/logos/partner5.png" },
    { name: "Partenaire 6", logo: "/logos/partner6.png" },
  ];

  useEffect(() => {
    fetchBlogPosts();

    const heroInterval = setInterval(() => {
      if (isAutoPlaying && !isPaused) {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }
    }, 7000);

    const testimonialInterval = setInterval(() => {
      if (!isPaused) {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }
    }, 8000);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(heroInterval);
      clearInterval(testimonialInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isAutoPlaying, isPaused]);

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

  const nextTestimonial = () => {
    setIsPaused(true);
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsPaused(false), 15000);
  };

  const prevTestimonial = () => {
    setIsPaused(true);
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsPaused(false), 15000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const stats = [
    { value: 1, label: 'Secteur par mois', icon: TrendingUp },
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
      {/* Motifs africains décoratifs */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.15] dark:opacity-20 z-0">
        <div className="african-pattern"></div>
      </div>

      <SEO
        title="MIDEESSI - Mouvement d'indépendance technologique béninoise"
        description="MIDEESSI crée des solutions 100% béninoises ancrées dans le terrain. Du Dahomey au Bénin, nous bâtissons notre souveraineté technologique."
        keywords={['MIDEESSI', 'Bénin', 'innovation', 'technologie béninoise', 'souveraineté', 'Dahomey', 'Cotonou']}
      />

      {/* Bouton scroll to top */}
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
      <section className="relative text-white py-20 md:py-32 overflow-hidden" role="banner">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#191970] via-[#ffd700] to-[#191970]"></div>
        
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-[#ffd700] opacity-20 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-[#ffd700] opacity-20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Images avec overlay plus prononcé */}
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

        {/* Boutons de navigation améliorés */}
        <button
          onClick={prevSlide}
          onKeyDown={(e) => handleKeyDown(e, prevSlide)}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-[#ffd700]/30 hover:bg-[#ffd700]/50 backdrop-blur-sm p-3 md:p-4 rounded-full transition-all duration-300 border-2 border-[#ffd700] focus:outline-none focus:ring-4 focus:ring-[#ffd700]/50"
          aria-label="Diapositive précédente"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          onKeyDown={(e) => handleKeyDown(e, nextSlide)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-[#ffd700]/30 hover:bg-[#ffd700]/50 backdrop-blur-sm p-3 md:p-4 rounded-full transition-all duration-300 border-2 border-[#ffd700] focus:outline-none focus:ring-4 focus:ring-[#ffd700]/50"
          aria-label="Diapositive suivante"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-32 bg-[#ffd700]"></div>
              
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
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#ffd700] text-[#191970] font-bold rounded-lg hover:bg-[#ffed4e] transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#ffd700]/50"
                >
                  Rejoignez le mouvement
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
                <a
                  href="/projects"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-[#ffd700] text-[#ffd700] font-bold rounded-lg hover:bg-[#ffd700]/10 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#ffd700]/50"
                >
                  Nos créations
                </a>
              </div>

              <div className="flex gap-3 mt-8" role="tablist" aria-label="Sélection de diapositive">
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

      {/* Stats Section avec compteurs animés */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-y-4 border-[#ffd700] transition-colors duration-300 relative">
        <div className="absolute top-4 left-4 w-16 h-16 border-2 border-[#191970] opacity-10 diamond-shape"></div>
        <div className="absolute bottom-4 right-4 w-20 h-20 border-2 border-[#ffd700] opacity-10 diamond-shape"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center transform hover:scale-105 transition-transform duration-300 relative group"
              >
                <div className="absolute inset-0 bg-[#ffd700]/5 rounded-lg transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                <div className="relative">
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-[#191970] dark:text-[#ffd700] opacity-50" />
                  <div className="text-4xl md:text-5xl font-bold text-[#191970] dark:text-[#ffd700] mb-2 flex items-center justify-center gap-1">
                    <CounterAnimation end={stat.value} />
                    {stat.suffix && <span>{stat.suffix}</span>}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
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
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Chaque mois, nous sélectionnons un secteur et nous immergeons sur le terrain pour créer des solutions adaptées aux besoins réels
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#ffd700] transform hover:-translate-y-2 relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#ffd700]/5 transform rotate-45 translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="w-14 h-14 bg-[#191970] rounded-lg flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative z-10">
                  <service.icon className="w-7 h-7 text-[#ffd700]" />
                </div>
                <h3 className="text-xl font-bold text-[#191970] dark:text-white mb-3 relative z-10">
                  {service.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 relative z-10 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-gradient-to-br from-[#191970] to-[#191970]/90 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="african-pattern"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="h-1 w-20 bg-[#ffd700] mx-auto mb-4"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ils témoignent
            </h2>
            <div className="h-1 w-20 bg-[#ffd700] mx-auto"></div>
          </div>

          <div className="relative min-h-[280px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ease-in-out ${
                  index === currentTestimonial
                    ? 'opacity-100 translate-x-0 relative'
                    : 'opacity-0 absolute inset-0 pointer-events-none'
                }`}
                aria-hidden={index !== currentTestimonial}
              >
                <div className="bg-white/10 backdrop-blur-sm p-8 md:p-12 rounded-lg border-2 border-[#ffd700]/40">
                  <div className="text-6xl text-[#ffd700] mb-4 leading-none">"</div>
                  <p className="text-xl md:text-2xl text-gray-100 mb-6 italic leading-relaxed">
                    {testimonial.quote}
                  </p>
                  <div className="border-t border-[#ffd700]/30 pt-4">
                    <p className="font-bold text-[#ffd700]">{testimonial.author}</p>
                    <p className="text-gray-300 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                onKeyDown={(e) => handleKeyDown(e, prevTestimonial)}
                className="p-2 bg-[#ffd700]/20 hover:bg-[#ffd700]/40 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                aria-label="Témoignage précédent"
              >
                <ChevronLeft className="w-5 h-5 text-[#ffd700]" />
              </button>
              
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentTestimonial(index);
                      setIsPaused(true);
                      setTimeout(() => setIsPaused(false), 15000);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ffd700] ${
                      index === currentTestimonial
                        ? 'w-12 bg-[#ffd700]'
                        : 'w-6 bg-white/40 hover:bg-[#ffd700]/60'
                    }`}
                    aria-label={`Témoignage ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                onKeyDown={(e) => handleKeyDown(e, nextTestimonial)}
                className="p-2 bg-[#ffd700]/20 hover:bg-[#ffd700]/40 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ffd700]"
                aria-label="Témoignage suivant"
              >
                <ChevronRight className="w-5 h-5 text-[#ffd700]" />
              </button>
            </div>
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
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                MIDEESSI est guidé par des valeurs profondes qui façonnent chaque solution que nous créons et chaque action que nous entreprenons.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-3 transform hover:translate-x-2 transition-all duration-300 bg-white dark:bg-gray-800 p-3 rounded-lg border-l-4 border-[#ffd700] hover:shadow-md"
                  >
                    <CheckCircle className="w-5 h-5 text-[#ffd700] flex-shrink-0" />
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#191970] dark:bg-gray-800 p-8 rounded-lg text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border-4 border-[#ffd700] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#ffd700]/10 rounded-full -translate-y-20 translate-x-20"></div>
              <Heart className="w-12 h-12 text-[#ffd700] mb-4 relative z-10" />
              <h3 className="text-2xl font-bold mb-4 relative z-10">Consommons 100% béninois</h3>
              <p className="text-gray-200 mb-6 relative z-10 leading-relaxed">
                Chaque solution MIDEESSI est un acte d'amour pour notre pays. Nous refusons la dépendance technologique et œuvrons pour la souveraineté numérique béninoise et africaine. Du Dahomey au Bénin, l'esprit d'indépendance perdure.
              </p>
              <a
                href="/about"
                className="inline-flex items-center text-[#ffd700] hover:text-[#ffed4e] font-semibold group relative z-10 focus:outline-none focus:underline"
              >
                Découvrir notre manifeste
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Carousel */}
      <section className="py-20 bg-white dark:bg-gray-900 border-y-2 border-[#ffd700]/20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-[#191970] dark:text-white mb-2">
              Ils nous font confiance
            </h3>
            <div className="h-1 w-16 bg-[#ffd700] mx-auto"></div>
          </div>
          
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll hover:pause-animation">
              {[...partners, ...partners].map((partner, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-48 mx-8 grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <div className="h-20 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-[#ffd700] transition-colors duration-300">
                    <span className="text-gray-400 dark:text-gray-500 font-semibold">
                      {partner.name}
                    </span>
                  </div>
                </div>
              ))}
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
        <div className="absolute inset-0 bg-[#191970]/85 dark:bg-black/85 z-0 transition-colors duration-300"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#ffd700]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Notre processus mensuel
            </h2>
            <div className="h-1 w-24 bg-[#ffd700] mx-auto mb-4"></div>
            <p className="text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed">
              De l'immersion terrain au déploiement, nous suivons une méthodologie rigoureuse ancrée dans les réalités béninoises
            </p>
          </div>

          {/* Version Desktop */}
          <div className="hidden md:grid md:grid-cols-5 gap-6">
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
              >
                <div className="overflow-hidden rounded-lg shadow-2xl border-2 border-[#ffd700]">
                  <div className="relative h-40 overflow-hidden bg-gray-200">
                    <img
                      src={item.img}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23191970" width="200" height="200"/%3E%3Ctext fill="%23ffd700" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E' + item.title + '%3C/text%3E%3C/svg%3E';
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
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                {index < 4 && (
                  <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
                    <ArrowRight className="w-6 h-6 text-[#ffd700] drop-shadow-lg" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Version Mobile - Timeline */}
          <div className="md:hidden space-y-8">
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
              <div key={index} className="relative">
                {index < 4 && (
                  <div className="absolute left-6 top-24 w-0.5 h-16 bg-[#ffd700]/40 z-0"></div>
                )}
                
                <div className="flex gap-4 items-start relative z-10">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#ffd700] text-[#191970] font-bold rounded-full flex items-center justify-center text-xl shadow-lg border-4 border-white dark:border-gray-800">
                      {item.step}
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg border-2 border-[#ffd700]/40 overflow-hidden">
                    <div className="relative h-32 overflow-hidden bg-gray-200">
                      <img
                        src={item.img}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-center"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23191970" width="200" height="200"/%3E%3Ctext fill="%23ffd700" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E' + item.title + '%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-200 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
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
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  Nos dernières réflexions et actualités du mouvement
                </p>
              </div>
              <a
                href="/blog"
                className="hidden md:inline-flex items-center text-[#191970] hover:text-[#ffd700] font-semibold group transition-colors duration-300 focus:outline-none focus:underline"
              >
                Voir tous les articles
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {loading ? (
                <>
                  <FeaturedPostSkeleton />
                  <FeaturedPostSkeleton />
                  <FeaturedPostSkeleton />
                </>
              ) : featuredPosts.length > 0 ? (
                featuredPosts.map((post, index) => (
                  <a
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white dark:bg-gray-900 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 hover:border-[#ffd700] transform hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-[#ffd700]/50"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23191970" width="400" height="300"/%3E%3Ctext fill="%23ffd700" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-[#ffd700] text-[#191970] text-xs font-bold rounded-full shadow-lg">
                          À la une
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                        {new Date(post.published_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <h3 className="text-xl font-bold text-[#191970] dark:text-white mb-2 group-hover:text-[#ffd700] transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <span className="inline-flex items-center text-[#191970] dark:text-[#ffd700] font-semibold text-sm group-hover:gap-2 transition-all duration-300">
                        Lire l'article
                        <ArrowRight className="ml-1 w-3 h-3" />
                      </span>
                    </div>
                  </a>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Aucun article à la une pour le moment. Restez connectés pour nos prochaines publications.
                  </p>
                </div>
              )}
            </div>
            <div className="md:hidden text-center">
              <a
                href="/blog"
                className="inline-flex items-center text-[#191970] hover:text-[#ffd700] font-semibold group transition-colors duration-300"
              >
                Voir tous les articles
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-[#191970] dark:bg-gray-900 text-white transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-32 h-32 border-4 border-[#ffd700] rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 border-4 border-[#ffd700] diamond-shape animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Globe className="w-16 h-16 text-[#ffd700] mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pour le Bénin. Pour l'Afrique. Pour le monde.
              </h2>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Rejoignez le mouvement d'indépendance technologique. Ensemble, bâtissons un avenir où chaque jeune béninois peut vivre dignement de son talent.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border-2 border-[#ffd700] shadow-2xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffd700]/10 rounded-full -translate-y-16 translate-x-16"></div>
              <Building2 className="w-12 h-12 text-[#ffd700] mb-4 relative z-10" />
              <h3 className="text-2xl font-bold mb-4 relative z-10">Notre appel</h3>
              <p className="text-gray-200 mb-6 relative z-10 leading-relaxed">
                Que vous soyez jeune béninois, entrepreneur local, membre de la diaspora ou partenaire africain, vous avez votre place dans ce mouvement. Créons ensemble l'excellence béninoise.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center w-full px-8 py-4 bg-[#ffd700] hover:bg-[#ffed4e] text-[#191970] font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg relative z-10 focus:outline-none focus:ring-4 focus:ring-[#ffd700]/50"
              >
                Contactez-nous
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-gradient-to-r from-[#191970] via-[#ffd700] to-[#191970] text-white relative overflow-hidden">
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