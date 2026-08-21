import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { getRoute } from '../utils/routes';

/* ============================================================
   DATA
   ============================================================ */
const serviceCards = [
  {
    title: 'Site Web & Applications',
    subtitle: 'Sites vitrines, boutiques et outils web sur mesure.',
    href: getRoute.solutionSiteweb(),
    image: '/siteweb_application.webp',
    background: '#F5F5F7',
    textColor: '#111111',
    accent: '#191970',
  },
  {
    title: 'Réseaux Sociaux',
    subtitle: 'Stratégie de contenu, engagement et croissance digitale.',
    href: getRoute.solutionDetail('reseaux-sociaux'),
    image: '/greseaux.webp',
    background: '#ECEEF4',
    textColor: '#111111',
    accent: '#191970',
  },
  {
    title: 'Couverture Événementielle',
    subtitle: 'Captation visuelle, diffusion et présence sur scène.',
    href: getRoute.solutionDetail('couverture-evenementielle'),
    image: '/cevent.webp',
    background: '#F5F5F7',
    textColor: '#111111',
    accent: '#191970',
  },
  {
    title: 'Automatisation & IA',
    subtitle: 'Workflows, outils et systèmes qui font gagner du temps.',
    href: getRoute.solutionDetail('automatisation-ia'),
    image: '/autoia.webp',
    background: '#191970',
    textColor: '#FFFFFF',
    accent: '#FFD700',
  },
];

const siteWebOffers = [
  {
    slug: 'vitrine',
    name: 'Présenter son entreprise & ses services',
    description: 'Site sur-mesure de 5 à 7 pages avec contact WhatsApp.',
    price: '75 000 FCFA',
    href: getRoute.solutionSitewebDetail('vitrine'),
    image: '/site_vitrine_placeholder.webp',
  },
  {
    slug: 'e-commerce',
    name: 'Vendre en ligne (local & international)',
    description: 'Boutique en ligne complète avec paiement Mobile Money.',
    price: '150 000 FCFA',
    href: getRoute.solutionSitewebDetail('e-commerce'),
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'application-web',
    name: 'Logiciel & outil de gestion interne',
    description: 'Portail client, tableaux de bord et outils de gestion.',
    price: '250 000 FCFA',
    href: getRoute.solutionSitewebDetail('application-web'),
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'application-mobile',
    name: 'Application mobile iOS & Android',
    description: 'Application fluide sur les stores pour vos utilisateurs.',
    price: 'Sur devis',
    href: getRoute.solutionSitewebDetail('application-mobile'),
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
  },
];

/* ============================================================
   SITEWEB PAGE — même design & hiérarchie que NewHome
   ============================================================ */
export const SiteWebPage = () => {
  useEffect(() => {
    document.title = 'Sites Web & Applications sur Mesure — MIDEESSI';
    const revealItems = document.querySelectorAll('[data-siteweb-reveal]');
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

  return (
    <>
      <style>{`
        [data-siteweb-reveal] {
          opacity: 0;
          transform: translate3d(0, 22px, 0);
          transition: opacity 700ms cubic-bezier(0.2,0,0.2,1),
                      transform 700ms cubic-bezier(0.2,0,0.2,1);
          will-change: opacity, transform;
        }
        [data-siteweb-reveal].is-visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
        @media (prefers-reduced-motion: reduce) {
          [data-siteweb-reveal] { opacity:1; transform:none; transition:none; }
        }
      `}</style>

      <SEO
        title="Sites Web & Applications sur Mesure — MIDEESSI"
        description="Sites vitrines, e-commerce et applications web sur mesure pensés pour vendre, convaincre et simplifier votre activité."
      />

      <div style={{ backgroundColor: '#FAFAFA' }}>

        {/* ═══════════════ HERO ═══════════════ */}
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

            

            <h1 className="font-bold text-center mx-auto"
              style={{ fontSize: 'clamp(36px, 7vw, 62px)', lineHeight: 1.06, letterSpacing: '-0.04em', color: 'var(--color-text-primary)', maxWidth: '820px' }}>
              <span style={{ display: 'block' }}>Vous voulez un site web pourquoi ?</span>
            </h1>

          </div>
        </section>

        <div className="w-full bg-white" style={{ height: '20px', margin: '0 0 1px 0' }} />

        {/* ═══════════════ OFFRES : SITES WEB ═══════════════ */}
        <section
          data-siteweb-reveal
          style={{ backgroundColor: '#FAFAFA', paddingTop: 'clamp(30px, 4vh, 60px)', paddingBottom: 'clamp(30px, 4vh, 60px)' }}
        >
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8">
              {siteWebOffers.slice(0, 2).map((offer, i) => (
                <Link
                  key={offer.slug}
                  to={offer.href}
                  className="group relative block h-[240px] xs:h-[300px] sm:h-[400px] md:h-[460px] w-full overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{ boxShadow: '0 24px 60px rgba(15,23,42,0.08)', transitionDelay: `${i * 80}ms` }}
                >
                  <img src={offer.image} alt={offer.name} loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="relative z-10 flex h-full flex-col justify-between p-4 xs:p-6 sm:p-8 md:p-10 text-white"
                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.85)' }}>
                    <div>
                      <h2 className="font-extrabold text-white text-xs xs:text-sm sm:text-xl md:text-2xl lg:text-3xl tracking-tight leading-tight">
                        {offer.name}
                      </h2>
                      <p className="hidden xs:block mt-1.5 sm:mt-3 text-[10px] sm:text-xs md:text-sm lg:text-base font-medium leading-relaxed max-w-md text-white/85">
                        {offer.description}
                      </p>
                      <div className="mt-2.5 sm:mt-6 inline-block rounded-lg px-2.5 py-1 sm:px-4 sm:py-2 font-bold text-[10px] xs:text-xs sm:text-sm"
                        style={{ backgroundColor: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.25)', color: '#FFD700' }}>
                        {offer.price}
                      </div>
                    </div>
                    <div className="flex items-center font-bold transition-colors group-hover:text-[#FFD700] text-[10px] xs:text-xs sm:text-sm">
                      Découvrir l'offre →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="w-full bg-white" style={{ height: '20px', margin: '0 0 1px 0' }} />

        {/* ═══════════════ OFFRES : APPLICATIONS ═══════════════ */}
        <section
          data-siteweb-reveal
          style={{ backgroundColor: '#FAFAFA', paddingTop: 'clamp(30px, 4vh, 60px)', paddingBottom: 'clamp(30px, 4vh, 60px)' }}
        >
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              
              <h2 className="font-bold text-center mx-auto text-[var(--color-text-primary)]"
                style={{ fontSize: 'clamp(36px, 7vw, 62px)', lineHeight: 1.06, letterSpacing: '-0.04em', maxWidth: '820px' }}>
                Vous voulez une application mobile pourquoi ?
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8">
              {siteWebOffers.slice(2, 4).map((offer, i) => (
                <Link
                  key={offer.slug}
                  to={offer.href}
                  className="group relative block h-[240px] xs:h-[300px] sm:h-[400px] md:h-[460px] w-full overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{ boxShadow: '0 24px 60px rgba(15,23,42,0.08)', transitionDelay: `${i * 80}ms` }}
                >
                  <img src={offer.image} alt={offer.name} loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="relative z-10 flex h-full flex-col justify-between p-4 xs:p-6 sm:p-8 md:p-10 text-white"
                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.85)' }}>
                    <div>
                      <h2 className="font-extrabold text-white text-xs xs:text-sm sm:text-xl md:text-2xl lg:text-3xl tracking-tight leading-tight">
                        {offer.name}
                      </h2>
                      <p className="hidden xs:block mt-1.5 sm:mt-3 text-[10px] sm:text-xs md:text-sm lg:text-base font-medium leading-relaxed max-w-md text-white/85">
                        {offer.description}
                      </p>
                      <div className="mt-2.5 sm:mt-6 inline-block rounded-lg px-2.5 py-1 sm:px-4 sm:py-2 font-bold text-[10px] xs:text-xs sm:text-sm"
                        style={{ backgroundColor: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.25)', color: '#FFD700' }}>
                        {offer.price}
                      </div>
                    </div>
                    <div className="flex items-center font-bold transition-colors group-hover:text-[#FFD700] text-[10px] xs:text-xs sm:text-sm">
                      Découvrir l'offre →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="w-full bg-white" style={{ height: '20px', margin: '0 0 1px 0' }} />

        {/* ═══════════════ CONTACT / BESOIN SPÉCIFIQUE ═══════════════ */}
        <section
          data-siteweb-reveal
          style={{ backgroundColor: '#F5F5F7', paddingTop: 'clamp(20px, 3vh, 40px)', paddingBottom: 'clamp(20px, 3vh, 40px)' }}
        >
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ boxShadow: '0 4px 16px rgba(15,23,42,0.04)' }}>
              <span className="text-sm font-medium text-center sm:text-left" style={{ color: '#6B7280' }}>
                Un projet spécifique ou sur-mesure ?
              </span>
              <Link to={getRoute.contact()}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm transition-transform duration-200 hover:scale-105 hover:shadow-xl flex-shrink-0"
                style={{ backgroundColor: '#191970', color: '#FFFFFF' }}>
                Nous contacter
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

/* ============================================================
   SOLUTIONS PAGE
   ============================================================ */
const Solutions = () => {
  useEffect(() => {
    document.title = 'Nos Solutions — MIDEESSI';

    const revealItems = document.querySelectorAll('[data-scroll-reveal]');
    if (!revealItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -20px 0px' }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        [data-scroll-reveal] {
          opacity: 0;
          transform: translate3d(0, 22px, 0);
          transition: opacity 700ms cubic-bezier(0.2, 0, 0.2, 1), transform 700ms cubic-bezier(0.2, 0, 0.2, 1);
          will-change: opacity, transform;
        }

        [data-scroll-reveal].is-visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        @media (prefers-reduced-motion: reduce) {
          [data-scroll-reveal] {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

      <div className="min-h-screen bg-[#FAFAFA] text-[#111111]">
        <SEO
          title="Nos Solutions — MIDEESSI"
          description="Des solutions digitales pensées pour être visibles, crédibles et performantes dès le premier contact."
        />

        <section style={{ paddingTop: 'clamp(88px, 14vh, 132px)', paddingBottom: '20px' }}>
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
            <div className="max-w-3xl">
              <span className="text-xs font-medium uppercase tracking-[0.14em] mb-4 block" style={{ color: '#6B7280' }}>
                Solutions
              </span>
              <div className="w-12 h-0.5 mb-8" style={{ backgroundColor: '#E5E7EB' }} />
              <h1
                className="font-bold mb-6"
                style={{
                  fontSize: 'clamp(32px, 7vw, 58px)',
                  lineHeight: 1.06,
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.04em',
                }}
              >
                Tout ce qu'il vous faut
              </h1>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'var(--color-text-secondary)', fontSize: 'clamp(16px, 2vw, 19px)' }}
              >
                Une suite de solutions conçues pour renforcer votre présence, vendre plus clairement et faire grandir votre activité.
              </p>
            </div>

            <div className="mt-12 grid gap-3 md:gap-6 md:grid-cols-2">
            {serviceCards.map((card, index) => (
              <div key={card.title} className="w-full">
              <Link
                to={card.href}
                data-scroll-reveal
                className="group relative block overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                style={{ backgroundColor: 'transparent' }}
              >
                <div
                  className="relative h-[340px] overflow-hidden"
                  style={{ backgroundColor: card.background }}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    style={{
                      filter: 'none',
                      opacity: 0.92,
                    }}
                  />

                  <div className="absolute inset-0 flex items-start justify-center p-4 md:p-6 text-center">
                    <div data-scroll-reveal style={{ transitionDelay: `${index * 100 + 80}ms` }}>
                      {
                        (() => {
                          const useLightBg = card.textColor !== '#FFFFFF';
                                       const bg = useLightBg ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.48)';
                          const text = card.textColor || (useLightBg ? '#111111' : '#FFFFFF');
                          return (
                            <div style={{ display: 'inline-block', backgroundColor: bg, padding: '0.5rem 0.75rem', borderRadius: 10 }}>
                                            <h2 className="text-2xl font-black tracking-tight md:text-3xl lg:text-4xl" style={{ color: text }}>
                                {card.title}
                              </h2>
                              <p className="mt-2 mx-auto max-w-[26rem] text-xs md:text-sm lg:text-base" style={{ color: text, opacity: 0.92, marginTop: '0.5rem' }}>
                                {card.subtitle}
                              </p>
                              <div className="mt-4">
                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold ${card.textColor === '#FFFFFF' ? 'bg-white text-[#191970]' : 'm-btn-primary'}`}>
                                  En savoir plus
                                </span>
                              </div>
                            </div>
                          );
                        })()
                      }
                    </div>
                  </div>
                </div>
              </Link>
              </div>
            ))}
          </div>
          </div>
        </section>
        
      </div>
    </>
  );
};

export default Solutions;
