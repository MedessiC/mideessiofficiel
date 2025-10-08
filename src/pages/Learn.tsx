import { useState, useEffect } from 'react';
import { BookOpen, Search, ExternalLink, Star, Calendar, Users, TrendingUp, Download, Award, Clock, Zap, Target, Filter, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
const Learn = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', name: 'Tous les PDFs', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'mobile', name: 'Tutoriels Mobile', icon: <Download className="w-4 h-4" /> },
    { id: 'cybersec', name: 'Cybersécurité', icon: <Award className="w-4 h-4" /> },
    { id: 'webdev', name: 'Développement Web', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'design', name: 'Design & UI/UX', icon: <Star className="w-4 h-4" /> },
    { id: 'business', name: 'Tech Business', icon: <Users className="w-4 h-4" /> },
    { id: 'data', name: 'Data & IA', icon: <Zap className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erreur:', error);
      } else {
        setBooks(data || []);
      }
      setLoading(false);
    };
    
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section - Optimisé Mobile */}
      <section className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-12 sm:py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 sm:w-96 sm:h-96 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-green-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-bold px-4 py-2 sm:px-6 rounded-full mb-4 sm:mb-6 animate-bounce text-sm sm:text-base">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Nouveau PDF chaque semaine !</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 sm:mb-6 tracking-tight">
              MIDEESSI <span className="text-yellow-400">Learn</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-3 sm:mb-4 leading-relaxed px-2">
              Apprenez la tech depuis votre téléphone avec des PDFs de qualité
            </p>
            
            <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-6 sm:mb-8">
              <span className="line-through text-gray-400 text-xl sm:text-2xl">5000 FCFA</span>
              <span>→</span>
              <span>1000 FCFA</span>
              <span className="text-white text-base sm:text-xl">/PDF</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm border border-yellow-400 rounded-xl px-4 py-3 sm:px-6 sm:py-4 hover:bg-white/20 transition-all">
                <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  <p className="font-bold text-sm sm:text-base">1 PDF par semaine</p>
                </div>
                <p className="text-xs sm:text-sm text-gray-300">Restez à jour</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-yellow-400 rounded-xl px-4 py-3 sm:px-6 sm:py-4 hover:bg-white/20 transition-all">
                <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  <p className="font-bold text-sm sm:text-base">100% Mobile</p>
                </div>
                <p className="text-xs sm:text-sm text-gray-300">Sans PC requis</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-yellow-400 rounded-xl px-4 py-3 sm:px-6 sm:py-4 hover:bg-white/20 transition-all">
                <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  <p className="font-bold text-sm sm:text-base">100% Béninois</p>
                </div>
                <p className="text-xs sm:text-sm text-gray-300">Par des experts locaux</p>
              </div>
            </div>

            <a 
              href="#pdfs" 
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-xl transition-all shadow-2xl hover:scale-105 text-base sm:text-lg"
            >
              <Target className="w-5 h-5 sm:w-6 sm:h-6" />
              Découvrir nos PDFs
            </a>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="relative mt-10 sm:mt-16 max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-1">1000F</p>
              <p className="text-xs sm:text-sm text-gray-300">Prix unique</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-1">52+</p>
              <p className="text-xs sm:text-sm text-gray-300">PDFs par an</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-1">500+</p>
              <p className="text-xs sm:text-sm text-gray-300">Étudiants actifs</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 mb-1">4.8/5</p>
              <p className="text-xs sm:text-sm text-gray-300">Note moyenne</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section - NON STICKY */}
      <section id="pdfs" className="bg-white dark:bg-gray-800 shadow-lg border-b-2 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search Bar et Bouton Filtres */}
            <div className="flex gap-2 sm:gap-3 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un PDF..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium text-sm sm:text-base"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl transition-all shadow-lg whitespace-nowrap text-sm sm:text-base"
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Filtres</span>
              </button>
            </div>

            {/* Nombre de résultats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                <span className="font-semibold">{filteredBooks.length} PDF{filteredBooks.length > 1 ? 's' : ''} disponible{filteredBooks.length > 1 ? 's' : ''}</span>
              </div>
              
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-yellow-500"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  Réinitialiser
                </button>
              )}
            </div>

            {/* Categories - Affichage conditionnel sur mobile */}
            {showFilters && (
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setShowFilters(false);
                    }}
                    className={`flex items-center justify-center gap-2 px-3 py-2 sm:px-4 rounded-lg font-medium transition-all text-sm ${
                      selectedCategory === category.id
                        ? 'bg-yellow-400 text-gray-900 shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category.icon}
                    <span className="text-xs sm:text-sm">{category.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PDFs Grid - Optimisé Mobile */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 sm:py-20">
              <div className="animate-spin w-12 h-12 sm:w-16 sm:h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Chargement des PDFs...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <BookOpen className="w-16 h-16 sm:w-24 sm:h-24 text-gray-400 mx-auto mb-4 sm:mb-6" />
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                {books.length === 0 ? 'Bientôt disponible' : 'Aucun PDF trouvé'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg px-4">
                {books.length === 0 
                  ? 'Notre premier PDF arrive très prochainement !'
                  : 'Essayez de modifier vos filtres ou votre recherche'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {filteredBooks.map(book => (
                <article
                  key={book.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border-2 border-gray-200 dark:border-gray-700 hover:border-yellow-400"
                >
                  {/* Book Cover */}
                  <div className={`relative h-40 sm:h-48 md:h-52 bg-gradient-to-br ${book.coverColor} p-4 sm:p-6 flex flex-col items-center justify-center`}>
                    {book.isNew && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 sm:px-3 rounded-full shadow-lg animate-pulse">
                        ✨ NOUVEAU
                      </div>
                    )}
                    <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white opacity-90 mb-2" />
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg">
                      <p className="text-white font-bold text-xs sm:text-sm">📱 100% Mobile</p>
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {book.weekAdded}
                      </span>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:text-yellow-500 transition-colors line-clamp-2">
                      {book.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 sm:mb-4 line-clamp-3">
                      {book.description}
                    </p>

                    <div className="flex items-center justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                          {book.rating}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{book.students}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4 sm:mb-5">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Prix unique</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-bold text-yellow-500">
                            {book.price}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">FCFA</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <a
                        href={book.articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2.5 sm:py-3 rounded-xl transition-all hover:scale-105 text-sm sm:text-base"
                      >
                        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Lire l'article
                      </a>
                      
                      <a
                        href={book.buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2.5 sm:py-3 rounded-xl transition-all shadow-lg hover:scale-105 text-sm sm:text-base"
                      >
                        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Acheter maintenant
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why MIDEESSI Learn Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Pourquoi choisir MIDEESSI Learn ?
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-12 md:mb-16">
            <div className="bg-white/10 backdrop-blur-lg border-2 border-yellow-400/50 rounded-2xl p-6 sm:p-8 text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-gray-900" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Nouveau contenu hebdomadaire</h3>
              <p className="text-gray-200 leading-relaxed text-sm sm:text-base">
                Recevez un nouveau PDF chaque semaine pour rester à la pointe de la technologie et progresser continuellement.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border-2 border-yellow-400/50 rounded-2xl p-6 sm:p-8 text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Download className="w-8 h-8 sm:w-10 sm:h-10 text-gray-900" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">100% accessible hors ligne</h3>
              <p className="text-gray-200 leading-relaxed text-sm sm:text-base">
                Téléchargez vos PDFs et apprenez où vous voulez, quand vous voulez, même sans connexion internet.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border-2 border-yellow-400/50 rounded-2xl p-6 sm:p-8 text-center hover:scale-105 transition-transform sm:col-span-2 md:col-span-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Award className="w-8 h-8 sm:w-10 sm:h-10 text-gray-900" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Expertise 100% locale</h3>
              <p className="text-gray-200 leading-relaxed text-sm sm:text-base">
                Contenu créé par des experts béninois qui comprennent vos besoins et défis spécifiques.
              </p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6 sm:p-8 md:p-12">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Ce que vous obtenez avec chaque PDF</h3>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-900 font-bold text-sm sm:text-base">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Contenu structuré et progressif</h4>
                  <p className="text-gray-300 text-sm sm:text-base">Du niveau débutant à avancé, avec des explications claires</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-900 font-bold text-sm sm:text-base">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Exemples pratiques</h4>
                  <p className="text-gray-300 text-sm sm:text-base">Des cas concrets et projets réalisables sur mobile</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-900 font-bold text-sm sm:text-base">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Ressources complémentaires</h4>
                  <p className="text-gray-300 text-sm sm:text-base">Liens vers des outils gratuits et tutoriels bonus</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-900 font-bold text-sm sm:text-base">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Format optimisé mobile</h4>
                  <p className="text-gray-300 text-sm sm:text-base">Lecture confortable sur tous les téléphones</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Prêt à commencer votre apprentissage ?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 px-4">
            Rejoignez des centaines d'étudiants qui apprennent la tech depuis leur mobile
          </p>
          <a 
            href="#pdfs" 
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-4 sm:px-10 sm:py-5 rounded-xl transition-all shadow-2xl hover:scale-105 text-base sm:text-lg"
          >
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            Découvrir nos PDFs à 1000F
          </a>
        </div>
      </section>

      {/* FAQ Section for SEO */}
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 sm:mb-12">
            Questions fréquentes
          </h2>
          
          <div className="space-y-4 sm:space-y-6">
            <details className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6 cursor-pointer group">
              <summary className="font-bold text-base sm:text-lg text-gray-900 dark:text-white list-none flex items-center justify-between">
                <span>Comment accéder aux PDFs après l'achat ?</span>
                <span className="text-yellow-500 text-xl group-open:rotate-180 transition-transform">+</span>
              </summary>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Après le paiement, vous recevrez un lien de téléchargement direct par email. Vous pourrez télécharger le PDF et le consulter hors ligne à tout moment.
              </p>
            </details>

            <details className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6 cursor-pointer group">
              <summary className="font-bold text-base sm:text-lg text-gray-900 dark:text-white list-none flex items-center justify-between">
                <span>Ai-je besoin d'un ordinateur pour suivre les formations ?</span>
                <span className="text-yellow-500 text-xl group-open:rotate-180 transition-transform">+</span>
              </summary>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Non ! Tous nos PDFs sont conçus pour être suivis 100% depuis votre téléphone. Nous privilégions les outils et applications mobiles gratuits.
              </p>
            </details>

            <details className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6 cursor-pointer group">
              <summary className="font-bold text-base sm:text-lg text-gray-900 dark:text-white list-none flex items-center justify-between">
                <span>Quel est le niveau requis ?</span>
                <span className="text-yellow-500 text-xl group-open:rotate-180 transition-transform">+</span>
              </summary>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                La plupart de nos PDFs sont accessibles aux débutants. Nous indiquons clairement le niveau requis dans la description de chaque formation.
              </p>
            </details>

            <details className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6 cursor-pointer group">
              <summary className="font-bold text-base sm:text-lg text-gray-900 dark:text-white list-none flex items-center justify-between">
                <span>Les PDFs sont-ils en français ?</span>
                <span className="text-yellow-500 text-xl group-open:rotate-180 transition-transform">+</span>
              </summary>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Oui, tous nos contenus sont rédigés en français par des experts locaux qui comprennent le contexte africain.
              </p>
            </details>

            <details className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6 cursor-pointer group">
              <summary className="font-bold text-base sm:text-lg text-gray-900 dark:text-white list-none flex items-center justify-between">
                <span>Comment se faire rembourser si le PDF ne me convient pas ?</span>
                <span className="text-yellow-500 text-xl group-open:rotate-180 transition-transform">+</span>
              </summary>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Nous offrons une garantie satisfaction. Si le contenu ne correspond pas à vos attentes dans les 7 jours suivant l'achat, contactez-nous pour un remboursement complet.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-yellow-400 to-orange-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            🚀 Ne manquez aucun nouveau PDF !
          </h3>
          <p className="text-base sm:text-lg text-gray-800 mb-6 sm:mb-8">
            Suivez-nous sur nos réseaux sociaux pour être notifié des nouveaux PDFs chaque semaine
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <a 
              href="#" 
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:scale-105 text-sm sm:text-base"
            >
              <span>📱</span>
              WhatsApp
            </a>
            <a 
              href="#" 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:scale-105 text-sm sm:text-base"
            >
              <span>👥</span>
              Facebook
            </a>
            <a 
              href="#" 
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:scale-105 text-sm sm:text-base"
            >
              <span>📸</span>
              Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Learn;