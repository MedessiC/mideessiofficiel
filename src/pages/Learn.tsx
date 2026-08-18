import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Search, Star, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

/* ============================================================
   TYPES
   ============================================================ */
interface Book {
  id: string;
  title: string;
  description: string;
  category?: string;
  price?: string | number;
  rating?: number;
  views?: number;
  students?: number;
  pages?: number;
  level?: string;
  is_new?: boolean;
  is_bestseller?: boolean;
  cover_image?: string;
  cover_color?: string;
  article_url?: string;
  buy_url?: string;
}

interface Course {
  id: string;
  title: string;
  description?: string;
  level?: string;
  duration?: string;
  price?: string | number;
  category?: string;
  cover?: string;
}

/* ============================================================
   LEARN PAGE
   ============================================================ */
const Learn = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'formations' | 'livres'>('formations');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'MIDEESSI Learn — Bibliothèque numérique';
    fetchBooks();
    fetchFormations();
  }, []);

  /* Scroll-reveal — identique à NewHome */
  useEffect(() => {
    const revealItems = document.querySelectorAll('[data-scroll-reveal]');
    if (!revealItems.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -20px 0px' }
    );
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (!location) return;
    if (location.pathname !== '/apprendre') return;
    const hash = (location.hash || '').replace('#', '');
    if (hash === 'livres') setActiveTab('livres');
    else if (hash === 'formations') setActiveTab('formations');
    else {
      const params = new URLSearchParams(location.search);
      const tab = params.get('tab');
      if (tab === 'livres' || tab === 'formations') setActiveTab(tab as 'formations' | 'livres');
    }
  }, [location]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) console.error('Erreur Supabase books:', error);
      else setBooks(data || []);
    } catch (err) {
      console.error('Erreur chargement books:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormations = async () => {
    try {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) { console.error('Erreur Supabase formations:', error); setCourses([]); }
      else setCourses((data as Course[]) || []);
    } catch (err) {
      console.error('Erreur chargement formations:', err);
      setCourses([]);
    }
  };

  const featuredCourses = courses.slice(0, 4);

  const filteredCourses = courses.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q) ||
      (c.category || '').toLowerCase().includes(q)
    );
  });

  const filteredBooks = books.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (b.title || '').toLowerCase().includes(q) ||
      (b.description || '').toLowerCase().includes(q) ||
      (b.category || '').toLowerCase().includes(q)
    );
  });

  return (
    <>
      <style>{`
        /* ── Scroll reveal (same as NewHome) ── */
        [data-scroll-reveal] {
          opacity: 0;
          transform: translate3d(0, 22px, 0);
          transition: opacity 700ms cubic-bezier(0.2,0,0.2,1),
                      transform 700ms cubic-bezier(0.2,0,0.2,1);
          will-change: opacity, transform;
        }
        [data-scroll-reveal].is-visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
        @media (prefers-reduced-motion: reduce) {
          [data-scroll-reveal] { opacity:1; transform:none; transition:none; }
        }
      `}</style>

      <SEO
        title="MIDEESSI Learn — Bibliothèque Tech Africaine"
        description="Des guides et livres PDF pratiques pour progresser en tech, entrepreneuriat et design depuis votre smartphone."
      />

      <div style={{ backgroundColor: '#FAFAFA' }}>

        {/* ═══════════════════════════════════════════════
            HERO — même rythme que NewHome HeroSection
            ═══════════════════════════════════════════════ */}
        <section
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: 'clamp(88px, 14vh, 132px) 0 clamp(40px, 5vh, 64px)',
          }}
        >
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 w-full">

            {/* Eyebrow */}
            <p
              className="text-sm uppercase text-center"
              style={{
                letterSpacing: '0.26em',
                color: 'var(--color-text-secondary)',
                marginBottom: '1.25rem',
              }}
            >
              MIDEESSI Learn
            </p>

            {/* H1 — même scale clamp que NewHome */}
            <h1
              className="font-bold text-center mx-auto"
              style={{
                fontSize: 'clamp(36px, 7vw, 62px)',
                lineHeight: 1.06,
                letterSpacing: '-0.04em',
                color: 'var(--color-text-primary)',
                maxWidth: '780px',
              }}
            >
              <span style={{ display: 'block' }}>Formations et</span>
              <span style={{ display: 'block', color: 'var(--color-brand)' }}>Livres</span>
            </h1>

            {/* Description */}
            <p
              className="text-center mx-auto"
              style={{
                marginTop: 'clamp(18px, 2.5vh, 28px)',
                fontSize: 'clamp(16px, 2vw, 20px)',
                lineHeight: 1.75,
                color: 'var(--color-text-secondary)',
                maxWidth: '540px',
              }}
            >
              Accédez à des connaissances qui vous correspondent et vous font évoluer.
            </p>

            {/* Divider décoratif */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginTop: 'clamp(36px, 5vh, 56px)',
              }}
            >
              <div style={{ height: '1px', width: '56px', backgroundColor: '#E5E7EB' }} />
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--color-brand)' }} />
              <div style={{ height: '1px', width: '56px', backgroundColor: '#E5E7EB' }} />
            </div>
          </div>
        </section>

        {/* White micro-spacer — identique à NewHome */}
        <div className="w-full bg-white" style={{ height: '20px', margin: '0 0 1px 0' }} />

        {/* ═══════════════════════════════════════════════
            BARRE RECHERCHE + ONGLETS — pleine largeur
            ═══════════════════════════════════════════════ */}
        <section
          data-scroll-reveal
          style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '18px 0' }}
        >
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">

              {/* Barre de recherche */}
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-secondary)' }}
                />
                <input
                  type="text"
                  placeholder="Rechercher une formation ou un livre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-full text-sm text-[#111827] outline-none focus:border-[var(--color-brand)] transition-colors"
                  style={{ boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}
                />
              </div>

              {/* Onglets */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setActiveTab('formations')}
                  className="px-5 py-3 rounded-xl font-semibold transition-all duration-200"
                  style={{
                    backgroundColor: activeTab === 'formations' ? '#191970' : 'transparent',
                    color: activeTab === 'formations' ? '#FFFFFF' : '#111111',
                    border: activeTab === 'formations' ? 'none' : '1px solid #E5E7EB',
                  }}
                >
                  Formations
                </button>
                <button
                  onClick={() => setActiveTab('livres')}
                  className="px-5 py-3 rounded-xl font-semibold transition-all duration-200"
                  style={{
                    backgroundColor: activeTab === 'livres' ? '#191970' : 'transparent',
                    color: activeTab === 'livres' ? '#FFFFFF' : '#111111',
                    border: activeTab === 'livres' ? 'none' : '1px solid #E5E7EB',
                  }}
                >
                  Livres
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            VUE FORMATIONS
            ═══════════════════════════════════════════════ */}
        {activeTab === 'formations' && (
          <>
            {/* Featured — fond sombre pleine largeur comme FullwidthCardSection */}
            <section
              data-scroll-reveal
              style={{
                backgroundColor: '#0F172A',
                paddingTop: 'clamp(30px, 4vh, 52px)',
                paddingBottom: 'clamp(30px, 4vh, 52px)',
              }}
            >
              <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
                <h2
                  className="font-bold mb-6"
                  style={{
                    fontSize: 'clamp(20px, 3vw, 28px)',
                    color: '#FFFFFF',
                    letterSpacing: '-0.02em',
                  }}
                >
                  FORMATIONS EN VEDETTE
                </h2>
                <div
                  className="flex gap-6 overflow-x-auto py-2 snap-x snap-mandatory items-stretch"
                  role="list"
                  aria-label="Formations en vedette"
                  style={{ scrollbarWidth: 'none' }}
                >
                  {featuredCourses.map((c) => (
                    <div
                      key={c.id}
                      className="w-[90%] max-w-[520px] snap-center flex-shrink-0 rounded-2xl overflow-hidden flex flex-col"
                      style={{
                        position: 'relative',
                        minHeight: '480px',
                        border: '1px solid rgba(255,255,255,0.04)',
                        boxShadow: '0 24px 60px rgba(15,23,42,0.18)',
                      }}
                      role="listitem"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${c.cover})` }}
                        aria-hidden
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(2,6,23,0.12) 0%, rgba(2,6,23,0.65) 70%)',
                        }}
                        aria-hidden
                      />
                      <div className="p-6 flex-1 flex flex-col justify-between" style={{ position: 'relative', zIndex: 2 }}>
                        <div>
                          <div className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{c.level}</div>
                          <h3 className="font-bold text-2xl mb-2" style={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}>{c.title}</h3>
                          <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>{c.description}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{c.duration}</div>
                          <div className="flex items-center gap-3">
                            <div className="font-semibold" style={{ color: '#FFD700' }}>{c.price}</div>
                            <Link
                              to={`/apprendre/formations/${c.id}`}
                              className="m-btn-primary transition-transform duration-200 hover:scale-105"
                            >
                              Voir
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* White micro-spacer */}
            <div className="w-full bg-white" style={{ height: '20px', margin: '0 0 1px 0' }} />

            {/* Catalogue */}
            <section
              data-scroll-reveal
              style={{
                backgroundColor: '#F5F5F7',
                paddingTop: 'clamp(30px, 4vh, 52px)',
                paddingBottom: 'clamp(30px, 4vh, 52px)',
              }}
            >
              <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
                <h2
                  className="font-bold mb-6"
                  style={{
                    fontSize: 'clamp(20px, 3vw, 28px)',
                    color: '#111827',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Toutes les formations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                  {filteredCourses.map((c) => (
                    <div
                      key={c.id}
                      className="w-full max-w-[420px] rounded-2xl overflow-hidden flex flex-col"
                      style={{
                        position: 'relative',
                        minHeight: '420px',
                        border: '1px solid #E5E7EB',
                        boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
                      }}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${c.cover})` }}
                        aria-hidden
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(245,245,247,0.06) 0%, rgba(245,245,247,0.78) 70%)',
                        }}
                        aria-hidden
                      />
                      <div className="p-5 flex-1 flex flex-col justify-between" style={{ position: 'relative', zIndex: 2 }}>
                        <div>
                          <div className="text-xs mb-1" style={{ color: '#6B7280' }}>Niveau : {c.level}</div>
                          <h3 className="font-bold text-lg mb-2" style={{ color: '#191970', letterSpacing: '-0.01em' }}>{c.title}</h3>
                          <p className="text-sm mb-4" style={{ color: '#4B5563', lineHeight: 1.6 }}>{c.description}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm" style={{ color: '#6B7280' }}>{c.duration}</div>
                          <div className="flex items-center gap-3">
                            <div className="font-semibold" style={{ color: '#111111' }}>{c.price}</div>
                            <Link to={`/apprendre/formations/${c.id}`} className="m-btn-primary">Voir</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Parcours recommandé */}
                <div
                  className="mt-10 bg-white rounded-2xl border border-[#E5E7EB] p-6"
                  style={{ boxShadow: '0 4px 16px rgba(15,23,42,0.04)' }}
                >
                  <h3 className="font-bold text-lg mb-3" style={{ color: '#111827', letterSpacing: '-0.01em' }}>
                    Vous débutez ? Commencez ici.
                  </h3>
                  <ol className="list-decimal ml-6 space-y-2" style={{ color: '#4B5563' }}>
                    <li>Comprendre le Web</li>
                    <li>HTML &amp; CSS</li>
                    <li>JavaScript</li>
                    <li>Projet complet</li>
                  </ol>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ═══════════════════════════════════════════════
            VUE LIVRES
            ═══════════════════════════════════════════════ */}
        {activeTab === 'livres' && (
          <section
            data-scroll-reveal
            style={{
              backgroundColor: '#FAFAFA',
              paddingTop: 'clamp(30px, 4vh, 52px)',
              paddingBottom: 'clamp(30px, 4vh, 52px)',
            }}
          >
            <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
              <h2
                className="font-bold mb-6"
                style={{
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  color: '#111827',
                  letterSpacing: '-0.02em',
                }}
              >
                Bibliothèque
              </h2>

              {loading ? (
                <div className="py-20 text-center">
                  <p className="text-sm font-medium" style={{ color: '#6B7280' }}>
                    Chargement des contenus MIDEESSI Learn...
                  </p>
                </div>
              ) : filteredBooks.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-[#E5E7EB] p-12">
                  <BookOpen size={40} className="mx-auto mb-4" style={{ color: '#6B7280' }} />
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#191970' }}>
                    Aucun PDF trouvé
                  </h3>
                  <p className="text-sm" style={{ color: '#4B5563' }}>
                    {searchQuery ? 'Essayez un autre mot-clé' : 'De nouveaux contenus seront ajoutés très prochainement.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      className="group w-full max-w-[420px] rounded-2xl overflow-hidden border border-[#E5E7EB] flex flex-col transition-all duration-200"
                      style={{
                        boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
                        backgroundColor: 'var(--bg-card)',
                        minHeight: '420px',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#191970'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB'; }}
                    >
                      {/* Cover */}
                      <div className="h-52 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        {book.cover_image ? (
                          <img
                            src={book.cover_image}
                            alt={book.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#191970]/5">
                            <BookOpen size={48} style={{ color: '#191970' }} />
                          </div>
                        )}
                        {book.category && (
                          <span className="absolute top-3 left-3 bg-[#191970] text-[#FAFAFA] text-[10px] font-semibold uppercase tracking-[0.1em] px-2.5 py-1 rounded-md">
                            {book.category}
                          </span>
                        )}
                      </div>

                      {/* Body */}
                      <div className="p-6 flex flex-col flex-1 justify-between">
                        <div>
                          <h3 className="font-bold text-base mb-2 line-clamp-2" style={{ color: '#191970', letterSpacing: '-0.01em' }}>
                            {book.title}
                          </h3>
                          <p className="text-xs leading-relaxed line-clamp-3 mb-6" style={{ color: '#4B5563' }}>
                            {book.description}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB] mb-4">
                            <div className="flex items-center gap-1 text-xs" style={{ color: '#6B7280' }}>
                              <Star size={14} className="fill-[#FFD700] text-[#FFD700]" />
                              <span className="font-semibold text-[#111111]">{book.rating || 4.8}</span>
                            </div>
                            <span className="font-bold text-lg" style={{ color: '#191970' }}>
                              {book.price === 0 || book.price === '0' ? 'Gratuit' : `${book.price || '1 000'} FCFA`}
                            </span>
                          </div>
                          <Link
                            to={`/library/${book.id}`}
                            className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-xs font-medium transition-all hover:opacity-90"
                            style={{ backgroundColor: '#191970', color: '#FAFAFA' }}
                          >
                            Consulter la fiche
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

      </div>
    </>
  );
};

export default Learn;