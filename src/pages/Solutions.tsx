import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

/* ============================================================
   DATA
   ============================================================ */
const serviceCards = [
  {
    title: 'Site Web & Applications',
    subtitle: 'Sites vitrines, boutiques et outils web sur mesure.',
    href: '/siteweb',
    image: '/siteweb_application.webp',
    background: '#F5F5F7',
    textColor: '#111111',
    accent: '#191970',
  },
  {
    title: 'Réseaux Sociaux',
    subtitle: 'Stratégie de contenu, engagement et croissance digitale.',
    href: '/solutions/reseaux-sociaux',
    image: '/greseaux.webp',
    background: '#ECEEF4',
    textColor: '#111111',
    accent: '#191970',
  },
  {
    title: 'Couverture Événementielle',
    subtitle: 'Captation visuelle, diffusion et présence sur scène.',
    href: '/solutions/couverture-evenementielle',
    image: '/cevent.webp',
    background: '#F5F5F7',
    textColor: '#111111',
    accent: '#191970',
  },
  {
    title: 'Automatisation & IA',
    subtitle: 'Workflows, outils et systèmes qui font gagner du temps.',
    href: '/solutions/automatisation-ia',
    image: '/autoia.webp',
    background: '#191970',
    textColor: '#FFFFFF',
    accent: '#FFD700',
  },
];

const siteWebOffers = [
  {
    slug: 'vitrine',
    name: 'Site Vitrine',
    description: 'Présentez votre entreprise avec crédibilité. 5 à 7 pages sur mesure, formulaire de contact, intégration WhatsApp et nom de domaine inclus.',
    price: '75 000 FCFA',
    href: '/siteweb/vitrine',
    image: '/site_vitrine_placeholder.webp',
  },
  {
    slug: 'e-commerce',
    name: 'Site E-commerce',
    description: 'Vendez vos produits 24h/24. Catalogue complet, gestion des commandes et paiement intégré Mobile Money (MTN, Moov, Wave) & Carte.',
    price: '150 000 FCFA',
    href: '/siteweb/e-commerce',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'application-web',
    name: 'Application Web',
    description: 'Digitalisez la gestion de votre activité. Espace client sécurisé, tableaux de bord, gestion de dossiers et automatisations sur mesure.',
    price: '250 000 FCFA',
    href: '/siteweb/application-web',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'application-mobile',
    name: 'Application Mobile',
    description: 'Déployez vos services directement sur les smartphones de vos utilisateurs (iOS & Android) avec une interface fluide et rapide.',
    price: 'Sur devis',
    href: '/siteweb/application-mobile',
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

            <p className="text-sm uppercase text-center"
              style={{ letterSpacing: '0.26em', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              Création Web &amp; Sur-Mesure
            </p>

            <h1 className="font-bold text-center mx-auto"
              style={{ fontSize: 'clamp(36px, 7vw, 62px)', lineHeight: 1.06, letterSpacing: '-0.04em', color: 'var(--color-text-primary)', maxWidth: '820px' }}>
              <span style={{ display: 'block' }}>Sites web &amp; applications</span>
            </h1>


          </div>
        </section>

        <div className="w-full bg-white" style={{ height: '20px', margin: '0 0 1px 0' }} />

        {/* ═══════════════ OFFRES ═══════════════ */}
        <section
          data-siteweb-reveal
          style={{ backgroundColor: '#FAFAFA', paddingTop: 'clamp(30px, 4vh, 60px)', paddingBottom: 'clamp(30px, 4vh, 60px)' }}
        >
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
            <div className="grid gap-8 md:grid-cols-2">
              {siteWebOffers.map((offer, i) => (
                <Link
                  key={offer.slug}
                  to={offer.href}
                  className="group relative block h-[420px] sm:h-[460px] w-full overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{ boxShadow: '0 24px 60px rgba(15,23,42,0.08)', transitionDelay: `${i * 80}ms` }}
                >
                  <img src={offer.image} alt={offer.name} loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-90"
                    style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.82) 0%,rgba(0,0,0,0.48) 50%,rgba(0,0,0,0.78) 100%)' }} />
                  <div className="relative z-10 flex h-full flex-col justify-between p-8 sm:p-10 text-white">
                    <div>
                      <h2 className="font-extrabold text-white"
                        style={{ fontSize: 'clamp(24px, 4vw, 36px)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                        {offer.name}
                      </h2>
                      <p className="mt-3 font-medium leading-relaxed max-w-md"
                        style={{ fontSize: 'clamp(13px, 1.6vw, 15px)', color: 'rgba(255,255,255,0.85)' }}>
                        {offer.description}
                      </p>
                      <div className="mt-6 inline-block rounded-lg px-4 py-2 font-bold backdrop-blur-md"
                        style={{ backgroundColor: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFD700', fontSize: '15px' }}>
                        {offer.price}
                      </div>
                    </div>
                    <div className="flex items-center font-bold transition-colors group-hover:text-[#FFD700]" style={{ fontSize: '14px' }}>
                      Découvrir l'offre →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="w-full bg-white" style={{ height: '20px', margin: '0 0 1px 0' }} />

        {/* ═══════════════ ENGAGEMENTS ═══════════════ */}
        <section
          data-siteweb-reveal
          style={{ backgroundColor: '#F5F5F7', paddingTop: 'clamp(30px, 4vh, 60px)', paddingBottom: 'clamp(30px, 4vh, 60px)' }}
        >
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
            <h2 className="font-bold mb-8 text-center"
              style={{ fontSize: 'clamp(22px, 3vw, 30px)', color: '#111827', letterSpacing: '-0.02em' }}>
              Ce qui est inclus dans chaque projet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Vitesse mobile 3G/4G', body: 'Site optimisé pour charger en moins de 2 secondes sur tous les réseaux locaux.' },
                { title: 'Hébergement & SSL offert', body: 'Nom de domaine et certificat de sécurité inclus pendant les 12 premiers mois.' },
                { title: 'Paiement échelonné', body: 'Possibilité de régler votre commande en 2 ou 3 tranches pour votre trésorerie.' },
                { title: 'Suivi & Support local', body: 'Une équipe basée au Bénin disponible pour mettre à jour et faire évoluer votre outil.' },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl p-6 border border-[#E5E7EB]"
                  style={{ boxShadow: '0 4px 16px rgba(15,23,42,0.04)' }}>
                  <strong className="block font-semibold mb-2" style={{ color: '#111111', fontSize: '15px' }}>{item.title}</strong>
                  <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>{item.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ boxShadow: '0 4px 16px rgba(15,23,42,0.04)' }}>
              <span className="text-sm font-medium text-center sm:text-left" style={{ color: '#6B7280' }}>
                Vous avez un besoin spécifique ou un projet sur-mesure ?
              </span>
              <Link to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm transition-transform duration-200 hover:scale-105 hover:shadow-xl flex-shrink-0"
                style={{ backgroundColor: '#191970', color: '#FFFFFF' }}>
                Parler de mon projet
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
                                <Link to={card.href} className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold ${card.textColor === '#FFFFFF' ? 'bg-white text-[#191970]' : 'm-btn-primary'}`}>
                                  En savoir plus
                                </Link>
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
