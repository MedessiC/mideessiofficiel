import { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, ArrowRight, User } from 'lucide-react';
import SEO from '../components/SEO';
import { getDaysRemaining } from '../data/ateliers';
import { supabase, Atelier } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const Ateliers = () => {
  const { user } = useAuth();
  const [ateliers, setAteliers] = useState<Atelier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState<'all' | 'online' | 'in-person'>('all');

  useEffect(() => {
    document.title = 'Nos Ateliers — MIDEESSI';
    fetchAteliers();
  }, []);

  const fetchAteliers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ateliers')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Erreur chargement ateliers:', error);
      } else {
        setAteliers(data || []);
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAteliers = ateliers.filter((atelier) => {
    const matchesSearch =
      atelier.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atelier.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterOption === 'online') matchesFilter = atelier.is_online;
    if (filterOption === 'in-person') matchesFilter = !atelier.is_online;

    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ backgroundColor: '#FAFAFA' }}>
      <SEO
        title="Nos Ateliers — MIDEESSI"
        description="Rejoignez nos ateliers pratiques pour développer vos compétences en tech, entrepreneuriat et design."
      />

      {/* ── Section Hero ── */}
      <section style={{ paddingTop: 'clamp(64px, 10vh, 120px)', paddingBottom: '64px' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <span className="text-xs font-medium uppercase tracking-[0.14em] mb-4 block" style={{ color: '#6B7280' }}>
              Formations & Practiques
            </span>
            <div className="w-12 h-0.5 mb-8" style={{ backgroundColor: '#E5E7EB' }} />
            <h1
              className="font-bold mb-6"
              style={{
                fontSize: 'clamp(36px, 6vw, 64px)',
                lineHeight: 1.05,
                color: '#191970',
                letterSpacing: '-0.02em',
              }}
            >
              Les Ateliers MIDEESSI.
            </h1>
            <p
              className="text-base leading-relaxed mb-8 max-w-2xl"
              style={{ color: '#4B5563', fontSize: 'clamp(16px, 2vw, 19px)' }}
            >
              Des sessions de formation concrètes animées par des professionnels pour acquérir des compétences pratiques.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section Recherche & Filtres ── */}
      <section style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', padding: '24px 0' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }} />
              <input
                type="text"
                placeholder="Rechercher un atelier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl text-sm text-[#111111] outline-none focus:border-[#191970] transition-colors"
              />
            </div>

            {/* Options */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterOption('all')}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  filterOption === 'all'
                    ? 'bg-[#191970] text-[#FAFAFA]'
                    : 'bg-[#FAFAFA] border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6]'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterOption('online')}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  filterOption === 'online'
                    ? 'bg-[#191970] text-[#FAFAFA]'
                    : 'bg-[#FAFAFA] border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6]'
                }`}
              >
                En ligne
              </button>
              <button
                onClick={() => setFilterOption('in-person')}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  filterOption === 'in-person'
                    ? 'bg-[#191970] text-[#FAFAFA]'
                    : 'bg-[#FAFAFA] border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6]'
                }`}
              >
                En présentiel
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section Liste des Ateliers ── */}
      <section style={{ backgroundColor: '#FAFAFA', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          {loading ? (
            <div className="py-20 text-center">
              <p className="text-sm font-medium" style={{ color: '#6B7280' }}>
                Chargement des ateliers...
              </p>
            </div>
          ) : filteredAteliers.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-[#E5E7EB] p-12">
              <Calendar size={40} className="mx-auto mb-4" style={{ color: '#6B7280' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#191970' }}>
                Aucun atelier trouvé
              </h3>
              <p className="text-sm" style={{ color: '#4B5563' }}>
                De nouveaux ateliers seront programmés très prochainement.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredAteliers.map((atelier) => (
                <div
                  key={atelier.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] flex flex-col transition-all duration-200"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#191970';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB';
                  }}
                >
                  <div className="p-8 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: '#191970' }}>
                          {atelier.category} · {atelier.is_online ? 'En ligne' : 'Présentiel'}
                        </span>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#FAFAFA] border border-[#E5E7EB]" style={{ color: '#6B7280' }}>
                          {atelier.price === 0 ? 'Gratuit' : `${atelier.price} FCFA`}
                        </span>
                      </div>

                      <h3 className="font-bold text-xl mb-3" style={{ color: '#111111' }}>
                        {atelier.title}
                      </h3>

                      <p className="text-sm leading-relaxed line-clamp-3 mb-6" style={{ color: '#4B5563' }}>
                        {atelier.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-4 text-xs pt-4 border-t border-[#E5E7EB] mb-6" style={{ color: '#6B7280' }}>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} style={{ color: '#191970' }} /> {atelier.date} ({atelier.time})
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} style={{ color: '#191970' }} /> {atelier.location}
                        </span>
                      </div>

                      <a
                        href={`/ateliers/${atelier.slug}`}
                        className="inline-flex items-center justify-center gap-2 w-full bg-[#191970] text-[#FAFAFA] rounded-xl py-3 text-xs font-medium transition-all hover:bg-[#141560]"
                      >
                        Voir les détails & s'inscrire
                        <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Ateliers;
