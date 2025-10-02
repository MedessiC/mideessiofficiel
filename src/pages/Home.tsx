import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Users, Target, Cpu, FolderTree, Rocket, Sparkles, Globe, Code, Layers, TrendingUp, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import BlogCard from '../components/BlogCard';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blogPosts';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const featuredProjects = [
    {
      title: 'TITO',
      description: 'Automatisez le tri et l\'organisation de vos fichiers avec notre IA intelligente.',
      status: 'Disponible',
      icon: <FolderTree className="w-6 h-6 text-gold" />,
    },
    {
      title: 'Application Essor',
      description: 'Plateforme de gestion de projets pour les communautés innovantes.',
      status: 'En cours',
      icon: <Rocket className="w-6 h-6 text-gold" />,
    },
    {
      title: 'Application Tcha-Tcha',
      description: 'Solution de communication en temps réel pour les équipes distribuées.',
      status: 'En cours',
      icon: <Cpu className="w-6 h-6 text-gold" />,
    },
  ];

  const latestPosts = blogPosts.slice(0, 3);

  const features = [
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Des solutions technologiques de pointe pour répondre aux défis modernes.',
      gradient: 'from-amber-400 to-orange-500',
    },
    {
      icon: Users,
      title: 'Communauté',
      description: 'Une approche collaborative pour construire ensemble l\'avenir.',
      gradient: 'from-blue-400 to-cyan-500',
    },
    {
      icon: Target,
      title: 'Indépendance',
      description: 'Liberté totale dans nos choix technologiques et notre vision.',
      gradient: 'from-purple-400 to-pink-500',
    }
  ];

  const techStack = [
    { name: 'React', icon: Code },
    { name: 'AI/ML', icon: Cpu },
    { name: 'Cloud', icon: Globe },
    { name: 'Mobile', icon: Sparkles },
    { name: 'Web', icon: Layers },
    { name: 'Data', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-white dark:bg-gray-900">
      <SEO
        title="MIDEESSI - Nous sommes indépendants | Solutions d'automatisation et d'IA"
        description="MIDEESSI développe des solutions innovantes d'automatisation et d'intelligence artificielle pour les communautés technologiques. Découvrez nos projets et rejoignez-nous."
        keywords={['automatisation', 'IA', 'intelligence artificielle', 'MIDEESSI', 'technologie', 'innovation', 'Bénin', 'startup africaine']}
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-midnight via-blue-900 to-indigo-900 dark:from-black dark:via-gray-900 dark:to-gray-800 text-white py-24 md:py-40 overflow-hidden">
        {/* Subtle background grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        {/* Gradient orbs - static */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold/20 rounded-full filter blur-3xl"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 left-40 w-80 h-80 bg-purple-500/20 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`text-center transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-gold to-white leading-tight">
              MIDEESSI
            </h1>
            
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 md:mb-6">
              <div className="h-1 w-10 sm:w-20 bg-gradient-to-r from-transparent to-gold"></div>
              <p className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-gold">
                Nous sommes indépendants
              </p>
              <div className="h-1 w-10 sm:w-20 bg-gradient-to-l from-transparent to-gold"></div>
            </div>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 text-gray-100 max-w-4xl mx-auto leading-relaxed font-light px-4">
              Nous développons des solutions innovantes, <span className="text-gold font-bold">Made in Bénin</span>, répondant aux besoins réels de notre population. Accessibles à tous, partout dans le monde
            </p>
            
            {/* Tech Stack Pills */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 md:mb-12 px-4">
              {techStack.map((tech, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20 hover:bg-white/20 hover:border-gold transition-all duration-300 cursor-pointer group"
                >
                  <tech.icon className="inline-block w-4 h-4 mr-1.5 sm:mr-2 group-hover:text-gold transition-colors" />
                  <span className="text-xs sm:text-sm font-semibold">{tech.name}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <Link
                to="/contact"
                className="group inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-midnight font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-gold/30 w-full sm:w-auto text-center justify-center"
              >
                <span className="text-base sm:text-lg">Rejoignez-nous</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link
                to="/projects"
                className="group inline-flex items-center space-x-2 sm:space-x-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl transition-all duration-300 border-2 border-white/30 hover:border-white/60 w-full sm:w-auto text-center justify-center"
              >
                <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-base sm:text-lg">Nos Projets</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full" preserveAspectRatio="none">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" 
                  fill="currentColor" 
                  className="text-white dark:text-gray-900">
            </path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900 relative -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10+', label: 'Projets Innovants', icon: TrendingUp },
              { number: '500+', label: 'Utilisateurs Actifs', icon: Users },
              { number: '100%', label: 'Made in Bénin', icon: Target },
              { number: '24/7', label: 'Support Disponible', icon: MessageCircle }
            ].map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="inline-flex items-center justify-center w-14 h-14 mb-3 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 group-hover:from-gold/30 group-hover:to-gold/10 transition-colors">
                  <stat.icon className="w-7 h-7 text-gold" />
                </div>
                <div className="text-4xl font-bold text-gold mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5">
              <Sparkles className="w-8 h-8 text-gold" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-midnight dark:text-white mb-4 leading-tight">
              Pourquoi MIDEESSI ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2 sm:px-0">
              Trois piliers fondamentaux qui guident notre mission
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-2 border-gray-100 dark:border-gray-700 hover:border-gold overflow-hidden ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                <div className="relative z-10">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300 shadow-lg`}
                  >
                    <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-midnight dark:text-white mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed px-2 sm:px-0">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-24 bg-gradient-to-br from-midnight via-blue-900 to-purple-900 dark:from-black dark:via-gray-900 dark:to-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 sm:w-96 h-64 sm:h-96 bg-gold rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 sm:w-96 h-64 sm:h-96 bg-blue-400 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Code className="w-6 h-6 text-gold" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Layers className="w-6 h-6 text-blue-400" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Rocket className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Nos Solutions Innovantes
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto px-2 sm:px-0">
              Des projets qui transforment les idées en réalité et résolvent des problèmes concrets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {featuredProjects.map((project, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <ProjectCard {...project} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/projects"
              className="group inline-flex items-center space-x-3 bg-white text-midnight hover:bg-gold hover:text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-300 text-base sm:text-lg hover:shadow-xl"
            >
              <Code className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Explorer tous nos projets</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-midnight dark:text-white mb-4 leading-tight">
              Articles & Actualités
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2 sm:px-0">
              Découvrez nos dernières réflexions et nouvelles technologies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {latestPosts.map((post, index) => (
              <div
                key={post.id}
                className={`transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <BlogCard {...post} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/blog"
              className="group inline-flex items-center space-x-3 text-gold hover:text-midnight dark:hover:text-white font-bold transition-colors duration-300 text-lg sm:text-xl"
            >
              <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Lire tous les articles</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 bg-gradient-to-br from-gold via-yellow-500 to-orange-500 text-midnight overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-midnight/10">
            <Sparkles className="w-10 h-10 text-midnight" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Prêt à transformer vos idées ?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl mb-12 font-medium leading-relaxed px-2 sm:px-0">
            Rejoignez la communauté MIDEESSI et créons ensemble le futur technologique du Bénin
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="group inline-flex items-center space-x-3 bg-midnight hover:bg-blue-900 text-white font-bold px-6 sm:px-10 py-4 sm:py-6 rounded-2xl transition-all duration-300 hover:shadow-2xl text-base sm:text-lg"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Contactez-nous maintenant</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <Link
              to="/projects"
              className="group inline-flex items-center space-x-3 bg-white hover:bg-gray-100 text-midnight font-bold px-6 sm:px-10 py-4 sm:py-6 rounded-2xl transition-all duration-300 hover:shadow-xl text-base sm:text-lg"
            >
              <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Voir nos réalisations</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;