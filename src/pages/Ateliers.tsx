import { Search, Zap, Calendar, MapPin, Rocket, Code, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import AtelierCard from '../components/AtelierCard';
import { atelierCategories, getDaysRemaining } from '../data/ateliers';
import { getIcon } from '../utils/iconMapper';
import { supabase, Atelier } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';

const Ateliers = () => {
  const [ateliers, setAteliers] = useState<Atelier[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState<'all' | 'this-week' | 'this-month' | 'online' | 'in-person'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high' | 'available'>('recent');

  useEffect(() => {
    fetchAteliers();
  }, []);

  const fetchAteliers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ateliers')
        .select('*')
        .eq('status', 'upcoming')
        .order('date', { ascending: true });

      if (error) throw error;
      
      // Transform database records to match Atelier interface
      if (data) {
        const transformedAteliers = data.map((atelier: any) => {
          // Fetch instructor details if instructor_id exists
          return {
            id: atelier.id,
            title: atelier.title,
            slug: atelier.slug,
            description: atelier.description,
            long_description: atelier.long_description,
            category: atelier.category,
            image: atelier.image,
            date: atelier.date,
            time: atelier.time,
            duration: atelier.duration,
            location: atelier.location,
            capacity: atelier.capacity,
            registered: atelier.registered || 0,
            language: atelier.language,
            level: atelier.level,
            instructor: {
              name: 'Expert MIDEESSI',
              title: 'Instructeur',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
              bio: 'Expert passionné dans son domaine'
            },
            objectives: atelier.objectives || [],
            program: [],
            prerequisites: atelier.prerequisites || [],
            materials: atelier.materials || [],
            price: atelier.price,
            tags: atelier.tags || [],
            is_online: atelier.is_online,
            meet_link: atelier.meet_link,
            status: atelier.status
          };
        });
        setAteliers(transformedAteliers);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setAteliers([]);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingAteliers = () => {
    const now = new Date();
    return ateliers
      .filter(atelier => {
        const atelierDate = new Date(atelier.date + 'T00:00:00');
        return atelierDate > now && atelier.status === 'upcoming';
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const upcomingAteliers = getUpcomingAteliers();

  // Appliquer les filtres
  let filteredAteliers = upcomingAteliers.filter((atelier) => {
    const matchesCategory = activeCategory ? atelier.category === activeCategory : true;
    const matchesSearch =
      atelier.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atelier.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atelier.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtres additionnels
    let matchesFilter = true;
    if (filterOption === 'this-week') {
      matchesFilter = getDaysRemaining(atelier.date) <= 7;
    } else if (filterOption === 'this-month') {
      matchesFilter = getDaysRemaining(atelier.date) <= 30;
    } else if (filterOption === 'online') {
      matchesFilter = atelier.is_online;
    } else if (filterOption === 'in-person') {
      matchesFilter = !atelier.is_online;
    }
    
    return matchesCategory && matchesSearch && matchesFilter;
  });

  // Appliquer le tri
  filteredAteliers = filteredAteliers.sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return getDaysRemaining(a.date) - getDaysRemaining(b.date);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'available':
        return (b.capacity - b.registered) - (a.capacity - a.registered);
      default:
        return 0;
    }
  });

  // Ateliers mis en avant (this week)
  const highlightedAteliers = filteredAteliers.filter((a) => getDaysRemaining(a.date) <= 7).slice(0, 2);
  const otherAteliers = filteredAteliers.filter((a) => getDaysRemaining(a.date) > 7);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-white dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <SEO
        title="Nos Ateliers | MIDEESSI - Formations & Workshops"
        description="Rejoignez nos ateliers interactifs pour développer vos compétences en technologie, business, design et marketing."
        keywords={['ateliers', 'formations', 'workshops', 'MIDEESSI', 'tech', 'business', 'design']}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-5 md:top-20 md:right-10 w-40 h-40 md:w-72 md:h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-5 md:bottom-20 md:left-10 w-48 h-48 md:w-96 md:h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-center tracking-tight leading-tight">
            Nos <span className="text-gold">Ateliers</span>
          </h1>
          <p className="text-base md:text-lg lg:text-2xl text-center text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
            Des formations pratiques animées par des experts pour maîtriser les dernières tendances en technologie, business et design.
          </p>

      {/* Search Bar */}
          <div className="mt-8 md:mt-12 max-w-4xl mx-auto">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre, tags, instructeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 md:py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {/* Quick Filter Options */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setFilterOption('all')}
                className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                  filterOption === 'all'
                    ? 'bg-gold text-midnight'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Zap className="w-3.5 h-3.5" /> Tous
              </button>
              <button
                onClick={() => setFilterOption('this-week')}
                className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                  filterOption === 'this-week'
                    ? 'bg-gold text-midnight'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" /> Cette semaine
              </button>
              <button
                onClick={() => setFilterOption('online')}
                className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                  filterOption === 'online'
                    ? 'bg-gold text-midnight'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Globe className="w-3.5 h-3.5" /> En ligne
              </button>
              <button
                onClick={() => setFilterOption('in-person')}
                className={`px-3 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                  filterOption === 'in-person'
                    ? 'bg-gold text-midnight'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" /> Présentiel
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 md:py-12 bg-gradient-to-r from-gold/10 via-transparent to-blue-500/10 dark:from-gold/5 dark:to-blue-500/5 border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-gold">{upcomingAteliers.length}</p>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">Ateliers à venir</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-gold">{atelierCategories.length}</p>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">Catégories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-gold">
                {Math.max(...ateliers.map((a) => a.capacity)).toLocaleString()}+
              </p>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">Participants</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-gold">5✨</p>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">Note moyenne</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-12 md:mb-16">
            <div className="flex items-center gap-2 mb-6 md:mb-8">
              <Code className="w-5 h-5 md:w-6 md:h-6 text-gold" />
              <h3 className="text-base md:text-lg font-bold text-midnight dark:text-white">Domaines d'expertise</h3>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3 md:px-4 py-2 md:py-2.5 rounded-full font-semibold transition-all text-sm md:text-base whitespace-nowrap ${
                  activeCategory === null
                    ? 'bg-gold text-midnight shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gold/30'
                }`}
              >
                Tous les domaines
              </button>

              {atelierCategories.map((category) => {
                const Icon = getIcon(category.iconName);
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-3 md:px-4 py-2 md:py-2.5 rounded-full font-semibold transition-all flex items-center gap-1.5 md:gap-2 text-sm md:text-base whitespace-nowrap ${
                      activeCategory === category.id
                        ? 'bg-gold text-midnight shadow-md'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gold/30'
                    }`}
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Options */}
          <div className="mb-8 md:mb-12 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {filteredAteliers.length} atelier{filteredAteliers.length > 1 ? 's' : ''} trouvé{filteredAteliers.length > 1 ? 's' : ''}
              </p>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-midnight dark:text-white focus:outline-none focus:border-gold"
            >
              <option value="recent">Les plus proches</option>
              <option value="price-low">Prix: Bas au Haut</option>
              <option value="price-high">Prix: Haut au Bas</option>
              <option value="available">Plus de places</option>
            </select>
          </div>

          {/* Highlighted Recent Ateliers */}
          {highlightedAteliers.length > 0 && getDaysRemaining(highlightedAteliers[0].date) <= 7 && (
            <div className="mb-12 md:mb-16">
              <div className="flex items-center gap-2 mb-6">
                <Rocket className="w-6 h-6 text-gold" />
                <h2 className="text-2xl md:text-3xl font-bold text-midnight dark:text-white">
                  À ne pas manquer cette semaine
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-6 lg:gap-8 mb-12">
                {highlightedAteliers.map((atelier) => (
                  <div key={atelier.id} className="relative">
                    <div className="absolute -top-2 sm:-top-3 md:-top-4 -right-2 sm:-right-3 md:-right-4 z-10 bg-gold text-midnight font-bold px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg shadow-lg text-xs sm:text-sm">
                      À bientôt!
                    </div>
                    <AtelierCard atelier={atelier} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Ateliers Grid */}
          {filteredAteliers.length > 0 ? (
            <div>
              {highlightedAteliers.length > 0 && <h2 className="text-2xl font-bold text-midnight dark:text-white mb-8">Tous les ateliers</h2>}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-6 lg:gap-8">
                {otherAteliers.map((atelier) => (
                  <AtelierCard key={atelier.id} atelier={atelier} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Zap className="w-16 h-16 text-gold/50 mx-auto mb-4" />
              <p className="text-lg md:text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Aucun atelier trouvé
              </p>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-500">
                Modifiez vos filtres ou vos critères de recherche
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-midnight to-blue-900 dark:from-gray-900 dark:to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
            Vous n'avez pas trouvé l'atelier idéal?
          </h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Contactez-nous pour nous proposer un atelier ou pour une formation personnalisée pour votre équipe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-6 md:px-8 py-3 md:py-4 bg-gold text-midnight font-bold rounded-lg hover:bg-gold/90 transition-colors inline-flex items-center justify-center"
            >
              Nous contacter
            </a>
            <a
              href="/about"
              className="px-6 md:px-8 py-3 md:py-4 border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold/10 transition-colors inline-flex items-center justify-center"
            >
              En savoir plus
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Ateliers;
