import { useState, useEffect } from 'react';
import { BookOpen, Search, ExternalLink, Star, Calendar, Users, TrendingUp, Download, Award, Clock, Zap, Target } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Learn = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'Tous les PDFs', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'mobile', name: 'Tutoriels Mobile', icon: <Download className="w-5 h-5" /> },
    { id: 'cybersec', name: 'Cybersécurité', icon: <Award className="w-5 h-5" /> },
    { id: 'webdev', name: 'Développement Web', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'design', name: 'Design & UI/UX', icon: <Star className="w-5 h-5" /> },
    { id: 'business', name: 'Tech Business', icon: <Users className="w-5 h-5" /> },
    { id: 'data', name: 'Data & IA', icon: <Zap className="w-5 h-5" /> },
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
      {/* SEO Meta Tags (à ajouter dans le Head de votre app) */}
      {/* 
      <title>MIDEESSI Learn - PDFs Tech à 1000 FCFA | Apprenez depuis votre Mobile</title>
      <meta name="description" content="Apprenez la tech depuis votre téléphone avec MIDEESSI Learn. Nouveaux PDFs chaque semaine à seulement 1000 FCFA. Tutoriels mobile, cybersécurité, développement web et plus." />
      <meta name="keywords" content="formation tech Bénin, PDF tech mobile, apprendre programmation mobile, cybersécurité Afrique, développement web Bénin, formation 1000 FCFA" />
      <meta property="og:title" content="MIDEESSI Learn - Formations Tech à 1000F" />
      <meta property="og:description" content="Un nouveau PDF tech chaque semaine à 1000 FCFA. Apprenez depuis votre mobile." />
      <meta property="og:type" content="website" />
      <link rel="canonical" href="https://mideessi.com/learn" />
      */}

      {/* Hero Section - SEO Optimized */}
      <section className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-96 h-96 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-bold px-6 py-2 rounded-full mb-6 animate-bounce">
              <Zap className="w-5 h-5" />
              <span>Nouveau PDF chaque semaine !</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              MIDEESSI <span className="text-yellow-400">Learn</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-4 leading-relaxed">
              Apprenez la tech depuis votre téléphone avec des PDFs de qualité
            </p>
            
            <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-bold text-yellow-400 mb-8">
              <span className="line-through text-gray-400 text-2xl">5000 FCFA</span>
              <span>→</span>
              <span>1000 FCFA</span>
              <span className="text-white text-xl">/PDF</span>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="bg-white/10 backdrop-blur-sm border border-yellow-400 rounded-xl px-6 py-4 hover:bg-white/20 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <p className="font-bold">1 PDF par semaine</p>
                </div>
                <p className="text-sm text-gray-300">Restez à jour</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-yellow-400 rounded-xl px-6 py-4 hover:bg-white/20 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <Download className="w-5 h-5 text-yellow-400" />
                  <p className="font-bold">100% Mobile</p>
                </div>
                <p className="text-sm text-gray-300">Sans PC requis</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-yellow-400 rounded-xl px-6 py-4 hover:bg-white/20 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <p className="font-bold">100% Béninois</p>
                </div>
                <p className="text-sm text-gray-300">Par des experts locaux</p>
              </div>
            </div>

            <a 
              href="#pdfs" 
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all shadow-2xl hover:scale-105 text-lg"
            >
              <Target className="w-6 h-6" />
              Découvrir nos PDFs
            </a>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="relative mt-16 max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-4xl font-bold text-yellow-400 mb-1">1000F</p>
              <p className="text-sm text-gray-300">Prix unique</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-yellow-400 mb-1">52+</p>
              <p className="text-sm text-gray-300">PDFs par an</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-yellow-400 mb-1">500+</p>
              <p className="text-sm text-gray-300">Étudiants actifs</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-yellow-400 mb-1">4.8/5</p>
              <p className="text-sm text-gray-300">Note moyenne</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section id="pdfs" className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-lg border-b-2 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un PDF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
                aria-label="Rechercher un PDF"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <BookOpen className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold">{filteredBooks.length} PDF{filteredBooks.length > 1 ? 's' : ''} disponible{filteredBooks.length > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-yellow-400 text-gray-900 shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-label={`Filtrer par ${category.name}`}
              >
                {category.icon}
                <span className="text-sm">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PDFs Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Chargement des PDFs...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                {books.length === 0 ? 'Bientôt disponible' : 'Aucun PDF trouvé'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {books.length === 0 
                  ? 'Notre premier PDF arrive très prochainement !'
                  : 'Essayez de modifier vos filtres ou votre recherche'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBooks.map(book => (
                <article
                  key={book.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border-2 border-gray-200 dark:border-gray-700 hover:border-yellow-400"
                  itemScope
                  itemType="https://schema.org/Course"
                >
                  {/* Book Cover */}
                  <div className={`relative h-52 bg-gradient-to-br ${book.coverColor} p-6 flex flex-col items-center justify-center`}>
                    {book.isNew && (
                      <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        ✨ NOUVEAU
                      </div>
                    )}
                    <BookOpen className="w-24 h-24 text-white opacity-90 mb-2" />
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <p className="text-white font-bold text-sm">📱 100% Mobile</p>
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400" itemProp="datePublished">
                        {book.weekAdded}
                      </span>
                    </div>
                    
                    <h3 
                      className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-yellow-500 transition-colors line-clamp-2"
                      itemProp="name"
                    >
                      {book.title}
                    </h3>
                    
                    <p 
                      className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3"
                      itemProp="description"
                    >
                      {book.description}
                    </p>

                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-gray-900 dark:text-white" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                          <span itemProp="ratingValue">{book.rating}</span>
                          <meta itemProp="bestRating" content="5" />
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                        <Users className="w-4 h-4" />
                        <span>{book.students} étudiants</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-5">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Prix unique</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-yellow-500" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                            <span itemProp="price">{book.price}</span>
                            <meta itemProp="priceCurrency" content="XOF" />
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">FCFA</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <a
                        href={book.articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 rounded-xl transition-all hover:scale-105"
                        aria-label={`Lire l'article sur ${book.title}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Lire l'article
                      </a>
                      
                      <a
                        href={book.buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl transition-all shadow-lg hover:scale-105"
                        aria-label={`Acheter ${book.title} pour ${book.price} FCFA`}
                      >
                        <Download className="w-4 h-4" />
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
      <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Pourquoi choisir MIDEESSI Learn ?
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-lg border-2 border-yellow-400/50 rounded-2xl p-8 text-center hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Nouveau contenu hebdomadaire</h3>
              <p className="text-gray-200 leading-relaxed">
                Recevez un nouveau PDF chaque semaine pour rester à la pointe de la technologie et progresser continuellement.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border-2 border-yellow-400/50 rounded-2xl p-8 text-center hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="w-10 h-10 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold mb-4">100% accessible hors ligne</h3>
              <p className="text-gray-200 leading-relaxed">
                Téléchargez vos PDFs et apprenez où vous voulez, quand vous voulez, même sans connexion internet.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border-2 border-yellow-400/50 rounded-2xl p-8 text-center hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Expertise 100% locale</h3>
              <p className="text-gray-200 leading-relaxed">
                Contenu créé par des experts béninois qui comprennent vos besoins et défis spécifiques.
              </p>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="bg-white/5 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-8 md:p-12">
            <h3 className="text-3xl font-bold mb-8 text-center">Ce que vous obtenez avec chaque PDF</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-900 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Contenu structuré et progressif</h4>
                  <p className="text-gray-300">Du niveau débutant à avancé, avec des explications claires</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-900 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Exemples pratiques</h4>
                  <p className="text-gray-300">Des cas concrets et projets réalisables sur mobile</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-900 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Ressources complémentaires</h4>
                  <p className="text-gray-300">Liens vers des outils gratuits et tutoriels bonus</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-900 font-bold">✓</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Format optimisé mobile</h4>
                  <p className="text-gray-300">Lecture confortable sur tous les téléphones</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Prêt à commencer votre apprentissage ?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Rejoignez des centaines d'étudiants qui apprennent la tech depuis leur mobile
          </p>
          <a 
            href="#pdfs" 
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-10 py-5 rounded-xl transition-all shadow-2xl hover:scale-105 text-lg"
          >
            <BookOpen className="w-6 h-6" />
            Découvrir nos PDFs à 1000F
          </a>
        </div>
      </section>

      {/* FAQ Section for SEO */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Questions fréquentes
          </h2>
          
          <div className="space-y-6">
            <details className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 cursor-pointer" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="font-bold text-lg text-gray-900 dark:text-white" itemProp="name">
                Comment accéder aux PDFs après l'achat ?
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-300" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <span itemProp="text">Après le paiement, vous recevrez un lien de téléchargement direct par email. Vous pourrez télécharger le PDF et le consulter hors ligne à tout moment.</span>
              </p>
            </details>

            <details className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 cursor-pointer" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="font-bold text-lg text-gray-900 dark:text-white" itemProp="name">
                Ai-je besoin d'un ordinateur pour suivre les formations ?
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-300" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <span itemProp="text">Non ! Tous nos PDFs sont conçus pour être suivis 100% depuis votre téléphone. Nous privilégions les outils et applications mobiles gratuits.</span>
              </p>
            </details>

            <details className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 cursor-pointer" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="font-bold text-lg text-gray-900 dark:text-white" itemProp="name">
                Quel est le niveau requis ?
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-300" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <span itemProp="text">La plupart de nos PDFs sont accessibles aux débutants. Nous indiquons clairement le niveau requis dans la description de chaque formation.</span>
              </p>
            </details>

            <details className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 cursor-pointer" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="font-bold text-lg text-gray-900 dark:text-white" itemProp="name">
                Les PDFs sont-ils en français ?
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-300" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <span itemProp="text">Oui, tous nos contenus sont rédigés en français par des experts locaux qui comprennent le contexte africain.</span>
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Learn;