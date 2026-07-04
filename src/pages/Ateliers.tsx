import { Search, Filter, Calendar, MapPin, Rocket, Code, Globe, User, BookOpen, Heart, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import AtelierCard from '../components/AtelierCard';
import { atelierCategories, getDaysRemaining } from '../data/ateliers';
import { getIcon } from '../utils/iconMapper';
import { supabase, Atelier } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

const Ateliers = () => {
  const { user } = useAuth();
  const [ateliers, setAteliers] = useState<Atelier[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState<'all' | 'this-week' | 'online' | 'in-person' | 'my-registrations' | 'favorites'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high' | 'available'>('recent');
  const [myRegistrations, setMyRegistrations] = useState<string[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchAteliers();
    loadBookmarks();
  }, []);

  useEffect(() => {
    if (user && ateliers.length > 0) {
      fetchMyRegistrations();
    }
  }, [user, ateliers]);

  const loadBookmarks = () => {
    try {
      const saved = localStorage.getItem('bookmarked_ateliers');
      if (saved) {
        setBookmarkedIds(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Error loading bookmarks:', err);
    }
  };

  const toggleBookmark = (id: string) => {
    let updated;
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter(bid => bid !== id);
    } else {
      updated = [...bookmarkedIds, id];
    }
    setBookmarkedIds(updated);
    localStorage.setItem('bookmarked_ateliers', JSON.stringify(updated));
  };

  const fetchMyRegistrations = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('atelier_registrations')
        .select('atelier_id')
        .eq('user_id', user.id);

      if (error) throw error;
      if (data) {
        setMyRegistrations(data.map((r: any) => r.atelier_id));
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    }
  };

  const fetchAteliers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ateliers')
        .select('*')
        .in('visibility', ['published', 'announced'])
        .order('date', { ascending: true });

      if (error) throw error;
      
      if (data) {
        const transformedAteliers = data.map((atelier: any) => {
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
              name: atelier.instructor_name || 'Expert MIDEESSI',
              title: atelier.instructor_title || 'Instructeur',
              image: atelier.instructor_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
              bio: atelier.instructor_bio || 'Expert passionné dans son domaine'
            },
            objectives: atelier.objectives || [],
            program: [],
            prerequisites: atelier.prerequisites || [],
            materials: atelier.materials || [],
            price: atelier.price,
            tags: atelier.tags || [],
            is_online: atelier.is_online ?? (atelier.format !== 'presentiel'),
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
    } else if (filterOption === 'online') {
      matchesFilter = atelier.is_online;
    } else if (filterOption === 'in-person') {
      matchesFilter = !atelier.is_online;
    } else if (filterOption === 'my-registrations') {
      matchesFilter = myRegistrations.includes(atelier.id);
    } else if (filterOption === 'favorites') {
      matchesFilter = bookmarkedIds.includes(atelier.id);
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
    <div className="min-h-screen pt-16 bg-[var(--bg-page)] dark:bg-gray-950 font-poppins selection:bg-gold selection:text-midnight">
      <SEO
        title="Nos Ateliers | MIDEESSI - Formations & Workshops"
        description="Rejoignez nos ateliers interactifs pour développer vos compétences en technologie, business, design et marketing."
        keywords={['ateliers', 'formations', 'workshops', 'MIDEESSI', 'tech', 'business', 'design']}
      />

      {/* Hero Section */}
      <section className="relative bg-[var(--brand-midnight)] text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-5 md:top-20 md:right-10 w-40 h-40 md:w-72 md:h-72 bg-gold/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-5 md:bottom-20 md:left-10 w-48 h-48 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/30 text-gold px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
              Développement Continu
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 tracking-tight leading-tight">
              Nos <span className="text-gold">Ateliers</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 font-medium leading-relaxed">
              Des formations pratiques animées par des experts pour maîtriser les dernières compétences en technologie, business et design.
            </p>
          </div>

          {/* Search Bar & Primary Filters */}
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre, tags, thématique..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 md:py-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              />
            </div>

            {/* Quick Filter Options */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setFilterOption('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  filterOption === 'all'
                    ? 'bg-gold text-midnight shadow-lg'
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterOption('this-week')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  filterOption === 'this-week'
                    ? 'bg-gold text-midnight shadow-lg'
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" /> Cette semaine
              </button>
              <button
                onClick={() => setFilterOption('online')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  filterOption === 'online'
                    ? 'bg-gold text-midnight shadow-lg'
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <Globe className="w-3.5 h-3.5" /> En ligne
              </button>
              <button
                onClick={() => setFilterOption('in-person')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  filterOption === 'in-person'
                    ? 'bg-gold text-midnight shadow-lg'
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" /> Présentiel
              </button>

              {/* Connected User Features */}
              {user && (
                <>
                  <button
                    onClick={() => setFilterOption('my-registrations')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      filterOption === 'my-registrations'
                        ? 'bg-gold text-midnight shadow-lg'
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" /> Inscriptions ({myRegistrations.length})
                  </button>
                  <button
                    onClick={() => setFilterOption('favorites')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      filterOption === 'favorites'
                        ? 'bg-gold text-midnight shadow-lg'
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" /> Favoris ({bookmarkedIds.length})
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-[var(--border)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center md:border-r border-gray-100 dark:border-gray-800 last:border-0">
              <p className="text-2xl md:text-3xl font-black text-[var(--brand-midnight)] dark:text-white">{upcomingAteliers.length}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Sessions planifiées</p>
            </div>
            <div className="text-center md:border-r border-gray-100 dark:border-gray-800 last:border-0">
              <p className="text-2xl md:text-3xl font-black text-gold">{atelierCategories.length}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Thématiques</p>
            </div>
            <div className="text-center md:border-r border-gray-100 dark:border-gray-800 last:border-0">
              <p className="text-2xl md:text-3xl font-black text-[var(--brand-midnight)] dark:text-white">
                {Math.max(...ateliers.map((a) => a.capacity), 0).toLocaleString()}+
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">Places disponibles</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-black text-gold">5 / 5</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Satisfaction globale</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category selector cards */}
        <div className="mb-10 md:mb-14">
          <div className="flex items-center gap-2 mb-5">
            <Code className="w-5 h-5 text-gold" />
            <h3 className="text-lg font-black text-midnight dark:text-white">Parcourir par thématique</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                activeCategory === null
                  ? 'bg-[var(--brand-midnight)] border-[var(--brand-midnight)] text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 border-[var(--border)] text-gray-700 dark:text-gray-300 hover:border-gold'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs font-bold">Tous</span>
            </button>

            {atelierCategories.map((category) => {
              const Icon = getIcon(category.iconName);
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-[var(--brand-midnight)] border-[var(--brand-midnight)] text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 border-[var(--border)] text-gray-700 dark:text-gray-300 hover:border-gold'
                  }`}
                >
                  <Icon className="w-5 h-5 text-gold" />
                  <span className="text-xs font-bold truncate w-full">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters and Sorting bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[var(--border)]">
          <div>
            <h2 className="text-xl font-black text-midnight dark:text-white">
              {filteredAteliers.length} session{filteredAteliers.length > 1 ? 's' : ''} disponible{filteredAteliers.length > 1 ? 's' : ''}
            </h2>
            <p className="text-xs text-gray-500">
              {filterOption === 'my-registrations' ? 'Affichage de vos ateliers enregistrés' : 'Trouvez la formation idéale'}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl border border-[var(--border)] bg-white dark:bg-gray-800 text-xs font-bold text-midnight dark:text-white focus:outline-none focus:border-gold"
            >
              <option value="recent">Date la plus proche</option>
              <option value="price-low">Prix : croissant</option>
              <option value="price-high">Prix : décroissant</option>
              <option value="available">Places disponibles</option>
            </select>
          </div>
        </div>

        {/* Highlighted section (this week) */}
        {highlightedAteliers.length > 0 && getDaysRemaining(highlightedAteliers[0].date) <= 7 && filterOption === 'all' && (
          <div className="mb-12 md:mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Rocket className="w-5 h-5 text-gold" />
              <h2 className="text-xl md:text-2xl font-black text-midnight dark:text-white">
                Dernière chance pour s'inscrire
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {highlightedAteliers.map((atelier) => (
                <div key={atelier.id} className="relative">
                  <div className="absolute top-4 right-4 z-10 bg-gold text-midnight font-bold px-3 py-1 rounded-xl shadow-lg text-xs">
                    Imminent
                  </div>
                  <AtelierCard
                    atelier={atelier}
                    isBookmarked={bookmarkedIds.includes(atelier.id)}
                    onBookmarkToggle={() => toggleBookmark(atelier.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Grid */}
        {filteredAteliers.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAteliers.map((atelier) => (
                <AtelierCard
                  key={atelier.id}
                  atelier={atelier}
                  isBookmarked={bookmarkedIds.includes(atelier.id)}
                  onBookmarkToggle={() => toggleBookmark(atelier.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-[var(--border)]">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-midnight dark:text-white mb-2">Aucune session trouvée</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              Ajustez vos filtres de recherche ou réinitialisez la catégorie pour découvrir d'autres formations.
            </p>
            <button
              onClick={() => { setActiveCategory(null); setFilterOption('all'); setSearchTerm(''); }}
              className="px-5 py-2.5 bg-[var(--brand-midnight)] hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </section>

      {/* Suggest a Workshop CTA */}
      <section className="py-16 md:py-24 bg-[var(--brand-midnight)] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
            Besoin d'un atelier sur-mesure ?
          </h2>
          <p className="text-sm md:text-base text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Nous organisons des sessions privées adaptées aux objectifs spécifiques de votre entreprise ou de votre équipe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-6 py-3.5 bg-gold text-midnight font-bold rounded-xl hover:shadow-lg active:scale-95 transition-all text-sm"
            >
              Demander une formation personnalisée
            </a>
            <a
              href="/about"
              className="px-6 py-3.5 border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 active:scale-95 transition-all text-sm"
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
