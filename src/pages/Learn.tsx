import { useState, useEffect } from 'react';
import { BookOpen, Star, Users, Download, Award, Clock, Zap, Smartphone, Lightbulb, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getIcon } from '../utils/iconMapper';

interface Book {
  id: string;
  title: string;
  description: string;
  category?: string;
  price?: string | number;
  rating?: number;
  students?: number;
  pages?: number;
  level?: string;
  is_new?: boolean;
  is_bestseller?: boolean;
  cover_image?: string;
  cover_color?: string;
  article_url?: string;
  buy_url?: string;
  week_added?: string;
}

const Learn = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'mobile', name: 'Tutoriels Mobile', iconName: 'Smartphone' },
    { id: 'cybersec', name: 'Cybersécurité', iconName: 'Lock' },
    { id: 'webdev', name: 'Développement Web', iconName: 'Code' },
    { id: 'design', name: 'Design & UI/UX', iconName: 'Sparkles' },
    { id: 'business', name: 'Tech Business', iconName: 'TrendingUp' },
    { id: 'data', name: 'Data & IA', iconName: 'Zap' },
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erreur:', error);
      } else {
        setBooks(data || []);
      }
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level?: string) => {
    switch(level) {
      case 'Débutant': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Avancé': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      {/* Hero Section - Ultra Compact */}
      <section className="relative bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white py-6 md:py-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-5 md:top-20 md:right-10 w-40 h-40 md:w-72 md:h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-5 md:bottom-20 md:left-10 w-48 h-48 md:w-96 md:h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
            Apprends avec <span className="text-gold">MIDEESSI Learn</span>
          </h1>
          <p className="text-sm md:text-base text-gray-200 max-w-2xl mb-6 md:mb-8">
            1000 FCFA par PDF • Zéro tergiversation • 100% sur mobile
          </p>
          <Link
            to="/library"
            className="inline-flex items-center gap-2 bg-gold hover:bg-yellow-500 text-midnight font-bold px-6 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl transition-all shadow-lg hover:scale-105 text-sm md:text-base"
          >
            <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
            Voir la Bibliothèque
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </div>
      </section>

      {/* Category Carousels Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12 md:py-20">
              <div className="animate-spin w-12 h-12 md:w-16 md:h-16 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Chargement des catégories...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <BookOpen className="w-16 h-16 md:w-24 md:h-24 text-gray-400 mx-auto mb-4 md:mb-6" />
              <h3 className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-300 mb-2 md:mb-3">
                Bientôt disponible
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base px-4">
                Notre premier PDF arrive très prochainement !
              </p>
            </div>
          ) : (
            <div className="space-y-12 md:space-y-16 lg:space-y-20">
              {categories.map(category => {
                const categoryBooks = books.filter(book => 
                  book.category === category.id || (book.category && book.category.toLowerCase() === category.name.toLowerCase())
                ).slice(0, 6);

                if (categoryBooks.length === 0) return null;

                return (
                  <div key={category.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-6 md:mb-8 pb-4 md:pb-6 border-b-2 border-gold/30">
                      <div className="flex items-center gap-3 md:gap-4">
                        {getIcon(category.iconName) && (() => {
                          const Icon = getIcon(category.iconName);
                          return <Icon className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-gold" />;
                        })()}
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                          {category.name}
                        </h2>
                      </div>
                      <Link 
                        to="/library" 
                        className="flex items-center gap-2 text-gold hover:text-yellow-500 font-semibold transition-colors text-sm md:text-base whitespace-nowrap"
                      >
                        Voir tous
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                      {categoryBooks.map(book => (
                        <article
                          key={book.id}
                          className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200 dark:border-gray-700 hover:border-gold"
                        >
                          <div className="relative h-40 md:h-48 lg:h-56 overflow-hidden bg-gray-200 dark:bg-gray-700">
                            {book.cover_image ? (
                              <img 
                                src={book.cover_image} 
                                alt={book.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  if (target.nextSibling) {
                                    (target.nextSibling as HTMLElement).style.display = 'flex';
                                  }
                                }}
                              />
                            ) : null}
                            <div 
                              className={`${book.cover_image ? 'hidden' : 'flex'} absolute inset-0 bg-gradient-to-br ${book.cover_color || 'from-midnight to-blue-900'} p-4 md:p-6 flex-col items-center justify-center`}
                            >
                              <BookOpen className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 text-white opacity-90 mb-2" />
                              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-lg">
                                <div className="text-white font-bold text-xs md:text-sm flex items-center gap-1.5">
                                  <Smartphone className="w-4 h-4" />
                                  100% Mobile
                                </div>
                              </div>
                            </div>

                            <div className="absolute top-2 md:top-3 right-2 md:right-3 flex flex-col gap-2">
                              {book.is_new && (
                                <div className="bg-gold text-midnight text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-lg animate-pulse flex items-center gap-1">
                                  <Lightbulb className="w-3 h-3 md:w-4 md:h-4" />
                                  <span>NOUVEAU</span>
                                </div>
                              )}
                              {book.is_bestseller && (
                                <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                  <Zap className="w-3 h-3 md:w-4 md:h-4" />
                                  <span>BEST</span>
                                </div>
                              )}
                            </div>

                            {book.level && (
                              <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3">
                                <span className={`text-xs font-bold px-2 md:px-3 py-1 rounded-full ${getLevelColor(book.level)}`}>
                                  {book.level}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-4 md:p-5 lg:p-6">
                            <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 group-hover:text-gold transition-colors line-clamp-2">
                              {book.title}
                            </h3>
                            
                            <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">
                              {book.description}
                            </p>

                            <div className="grid grid-cols-3 gap-2 md:gap-3 mb-3 md:mb-4 pb-3 md:pb-4 border-b border-gray-200 dark:border-gray-700">
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <Star className="w-3 h-3 md:w-4 md:h-4 text-gold fill-gold" />
                                  <span className="font-bold text-xs md:text-sm">{book.rating || 4.8}</span>
                                </div>
                                <p className="text-xs text-gray-500">Note</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <Users className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                                  <span className="font-bold text-xs md:text-sm">{book.students || 150}</span>
                                </div>
                                <p className="text-xs text-gray-500">Étudiants</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                  <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                                  <span className="font-bold text-xs md:text-sm">{book.pages || 50}</span>
                                </div>
                                <p className="text-xs text-gray-500">Pages</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4 md:mb-5">
                              <div className="flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Prix</p>
                                <div className="flex items-baseline gap-1 md:gap-2">
                                  <span className="text-xl md:text-2xl font-bold text-gold">
                                    {book.price || '1000'}
                                  </span>
                                  <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">FCFA</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <a
                                href={book.article_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2 md:py-2.5 rounded-lg md:rounded-xl transition-all hover:scale-105 text-xs md:text-sm"
                              >
                                <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                Lire l'article
                              </a>
                              
                              <a
                                href={book.buy_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-gold hover:bg-yellow-500 text-midnight font-bold py-2 md:py-2.5 rounded-lg md:rounded-xl transition-all shadow-md hover:scale-105 text-xs md:text-sm"
                              >
                                <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                Acheter maintenant
                              </a>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why MIDEESSI Learn Section - Midnight Theme */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Pourquoi MIDEESSI Learn ?
            </h2>
            <div className="w-16 md:w-20 h-1 bg-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12 lg:mb-16">
            <div className="bg-white/10 backdrop-blur-lg border border-gold/30 hover:border-gold/60 rounded-xl md:rounded-2xl p-6 md:p-8 text-center transition-all hover:scale-105">
              <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Clock className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-midnight" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4">Nouveau chaque semaine</h3>
              <p className="text-gray-200 leading-relaxed text-sm md:text-base">
                Un nouveau PDF chaque semaine. Reste actualisé sans stresser.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-gold/30 hover:border-gold/60 rounded-xl md:rounded-2xl p-6 md:p-8 text-center transition-all hover:scale-105">
              <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Download className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-midnight" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4">100% sur téléphone</h3>
              <p className="text-gray-200 leading-relaxed text-sm md:text-base">
                Télécharge et apprends sans WiFi. N'importe où, n'importe quand.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-gold/30 hover:border-gold/60 rounded-xl md:rounded-2xl p-6 md:p-8 text-center transition-all hover:scale-105 md:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Award className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-midnight" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4">Expertise locale</h3>
              <p className="text-gray-200 leading-relaxed text-sm md:text-base">
                Made in Benin. Par des gens qui comprennent ton contexte.
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-gold/20 rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-12">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8 text-center">Ce que vous obtenez avec chaque PDF</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-6 h-6 md:w-7 md:h-7 bg-gold rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-midnight" />
                </div>
                <div>
                  <h4 className="font-bold text-base md:text-lg mb-1 md:mb-2">Contenu structuré et progressif</h4>
                  <p className="text-gray-300 text-sm md:text-base">Du niveau débutant à avancé, avec des explications claires</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-6 h-6 md:w-7 md:h-7 bg-gold rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-midnight" />
                </div>
                <div>
                  <h4 className="font-bold text-base md:text-lg mb-1 md:mb-2">Exemples pratiques</h4>
                  <p className="text-gray-300 text-sm md:text-base">Des cas concrets et projets réalisables sur mobile</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-6 h-6 md:w-7 md:h-7 bg-gold rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-midnight" />
                </div>
                <div>
                  <h4 className="font-bold text-base md:text-lg mb-1 md:mb-2">Ressources complémentaires</h4>
                  <p className="text-gray-300 text-sm md:text-base">Liens vers des outils gratuits et tutoriels bonus</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-6 h-6 md:w-7 md:h-7 bg-gold rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-midnight" />
                </div>
                <div>
                  <h4 className="font-bold text-base md:text-lg mb-1 md:mb-2">Format optimisé mobile</h4>
                  <p className="text-gray-300 text-sm md:text-base">Lecture confortable sur tous les téléphones</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
            Prêt à apprendre ?
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 md:mb-8">
            Des centaines de gens apprennent déjà la tech depuis leur téléphone. Rejoins-les.
          </p>
          <a 
            href="#pdfs" 
            className="inline-flex items-center gap-2 bg-gold hover:bg-yellow-500 text-midnight font-bold px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl transition-all shadow-lg hover:scale-105 text-sm md:text-base"
          >
            <BookOpen className="w-5 h-5" />
            Voir les PDFs (1000F)
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 md:mb-12">
            Questions fréquentes
          </h2>
          
          <div className="space-y-3 md:space-y-4">
            <details className="bg-gray-50 dark:bg-gray-700 rounded-lg md:rounded-xl p-4 md:p-6 cursor-pointer group">
              <summary className="font-bold text-base md:text-lg text-gray-900 dark:text-white list-none flex items-center justify-between">
                <span>Comment accéder aux PDFs après l'achat ?</span>
                <span className="text-gold text-xl group-open:rotate-180 transition-transform">+</span>
              </summary>
              <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Après le paiement, vous recevrez un lien de téléchargement direct par email. Vous pourrez télécharger le PDF et le consulter hors ligne à tout moment.
              </p>
            </details>

            <details className="bg-gray-50 dark:bg-gray-700 rounded-lg md:rounded-xl p-4 md:p-6 cursor-pointer group">
              <summary className="font-bold text-base md:text-lg text-gray-900 dark:text-white list-none flex items-center justify-between">
                <span>Ai-je besoin d'un ordinateur pour suivre les formations ?</span>
                <span className="text-gold text-xl group-open:rotate-180 transition-transform">+</span>
              </summary>
              <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Non ! Tous nos PDFs sont conçus pour être suivis 100% depuis votre téléphone. Nous privilégions les outils et applications mobiles gratuits.
              </p>
            </details>

            <details className="bg-gray-50 dark:bg-gray-700 rounded-lg md:rounded-xl p-4 md:p-6 cursor-pointer group">
              <summary className="font-bold text-base md:text-lg text-gray-900 dark:text-white list-none flex items-center justify-between">
                <span>Quel est le niveau requis ?</span>
                <span className="text-gold text-xl group-open:rotate-180 transition-transform">+</span>
              </summary>
              <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                La plupart de nos PDFs sont accessibles aux débutants. Nous indiquons clairement le niveau requis dans la description de chaque formation.
              </p>
            </details>

            <details className="bg-gray-50 dark:bg-gray-700 rounded-lg md:rounded-xl p-4 md:p-6 cursor-pointer group">
              <summary className="font-bold text-base md:text-lg text-gray-900 dark:text-white list-none flex items-center justify-between">
                <span>Les PDFs sont-ils en français ?</span>
                <span className="text-gold text-xl group-open:rotate-180 transition-transform">+</span>
              </summary>
              <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Oui, tous nos contenus sont rédigés en français par des experts locaux qui comprennent le contexte africain.
              </p>
            </details>

            <details className="bg-gray-50 dark:bg-gray-700 rounded-lg md:rounded-xl p-4 md:p-6 cursor-pointer group">
              <summary className="font-bold text-base md:text-lg text-gray-900 dark:text-white list-none flex items-center justify-between">
                <span>Comment se faire rembourser si le PDF ne me convient pas ?</span>
                <span className="text-gold text-xl group-open:rotate-180 transition-transform">+</span>
              </summary>
              <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Nous offrons une garantie satisfaction. Si le contenu ne correspond pas à vos attentes dans les 7 jours suivant l'achat, contactez-nous pour un remboursement complet.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-8 md:py-12 bg-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
            Ne manquez aucun nouveau PDF !
          </h3>
          <p className="text-base md:text-lg text-gray-800 mb-6 md:mb-8">
            Suivez-nous sur nos réseaux sociaux pour être notifié des nouveaux PDFs chaque semaine
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <a 
              href="#" 
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl transition-all shadow-md hover:scale-105 text-xs md:text-sm"
            >
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
              <span>WhatsApp</span>
            </a>
            <a 
              href="#" 
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl transition-all shadow-md hover:scale-105 text-xs md:text-sm"
            >
              <Users className="w-4 h-4 md:w-5 md:h-5" />
              <span>Facebook</span>
            </a>
            <a 
              href="#" 
              className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl transition-all shadow-md hover:scale-105 text-xs md:text-sm"
            >
              <Smartphone className="w-4 h-4 md:w-5 md:h-5" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Learn;