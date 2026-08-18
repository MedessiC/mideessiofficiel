import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import { solutions } from '../data/solutions';

const Projects = () => {
  useEffect(() => {
    document.title = 'Nos Projets — MIDEESSI';
  }, []);

  return (
    <div style={{ backgroundColor: '#FAFAFA' }}>
      <SEO
        title="Nos Projets — MIDEESSI"
        description="Découvrez nos projets et initiatives technologiques concrètes développées au Bénin."
      />

      {/* ── Section Hero ── */}
      <section style={{ paddingTop: 'clamp(64px, 10vh, 120px)', paddingBottom: '64px' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <span className="text-xs font-medium uppercase tracking-[0.14em] mb-4 block" style={{ color: '#6B7280' }}>
              Initiatives & Réalisations
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
              Du terrain à la solution.
            </h1>
            <p
              className="text-base leading-relaxed mb-8 max-w-2xl"
              style={{ color: '#4B5563', fontSize: 'clamp(16px, 2vw, 19px)' }}
            >
              Chaque projet MIDEESSI répond à une observation de terrain et à un problème réel.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section Grille des Projets ── */}
      <section style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E7EB', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution) => (
              <div
                key={solution.id}
                className="group bg-[#FAFAFA] rounded-2xl overflow-hidden border border-[#E5E7EB] flex flex-col transition-all duration-200"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#191970';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB';
                }}
              >
                {/* Image */}
                <div className="h-56 bg-[#F3F4F6] overflow-hidden relative">
                  {solution.image ? (
                    <img
                      src={solution.image}
                      alt={solution.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🚀</div>
                  )}
                  {solution.status && (
                    <span className="absolute top-3 left-3 bg-[#191970] text-[#FAFAFA] text-[10px] font-semibold uppercase tracking-[0.1em] px-2.5 py-1 rounded-md">
                      {solution.status}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1 justify-between">
                  <div>
                    <h2 className="font-bold text-xl mb-2" style={{ color: '#191970' }}>
                      {solution.name}
                    </h2>
                    <p className="text-xs font-medium mb-4" style={{ color: '#6B7280' }}>
                      {solution.tagline}
                    </p>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: '#4B5563' }}>
                      {solution.description}
                    </p>

                    {solution.features && solution.features.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {solution.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs" style={{ color: '#111111' }}>
                            <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#191970' }} />
                            <span>{feature.title || feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#E5E7EB]">
                    <Link
                      to={`/solutions/${solution.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all"
                      style={{ color: '#191970' }}
                    >
                      Découvrir l'initiative
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;