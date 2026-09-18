import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import { getFormationBySlug } from '../data/formationsData';

const FormationDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [showAlternateAudience, setShowAlternateAudience] = useState(false);

  const formation = getFormationBySlug(slug || '');

  useEffect(() => {
    if (formation) {
      document.title = `${formation.heroTitle || formation.title} — MIDEESSI Learn`;
    }
  }, [formation]);

  /* Scroll-reveal */
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

  useEffect(() => {
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    const timer = window.setInterval(() => {
      setShowAlternateAudience((current) => !current);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  if (!formation) {
    return (
      <div className="min-h-screen pt-32 pb-16 bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <h1 className="text-2xl font-bold text-[#111827] mb-2">Formation introuvable</h1>
          <p className="text-sm text-[#4B5563] mb-6">
            La formation que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <button
            onClick={() => navigate('/apprendre')}
            className="m-btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour aux formations
          </button>
        </div>
      </div>
    );
  }

  const handleInscription = () => {
    // Redirection vers contact / commande en attendant la page d'inscription dédiée
    navigate('/contact');
  };

  const handleStartParcours = () => {
    navigate(`/apprendre/formations/${formation.slug}/parcours`);
  };

  return (
    <>
      <style>{`
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
        title={`${formation.heroTitle || formation.title} — MIDEESSI Learn`}
        description={formation.description}
      />

      <div style={{ backgroundColor: '#FAFAFA' }}>

        {/* ═══════════════════════════════════════════════
            1. HERO — même style, typographie et clamp que NewHome HeroSection
            ═══════════════════════════════════════════════ */}
        <section
          style={{
            backgroundColor: '#FAFAFA',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: 'clamp(88px, 14vh, 132px) 0 clamp(40px, 5vh, 64px)',
          }}
        >
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 w-full text-center">

            {/* H1 — centré */}
            <h1
              className="font-bold text-center mx-auto"
              style={{
                fontSize: 'clamp(32px, 7vw, 58px)',
                lineHeight: 1.06,
                letterSpacing: '-0.04em',
                color: 'var(--color-text-primary)',
                maxWidth: '820px',
              }}
            >
              {formation.slug === 'developpement-web' ? (
                <>
                  Créer un <span style={{ color: '#191970' }}>site Web</span> moderne en 2026
                </>
              ) : formation.slug === 'cybersecurite' ? (
                <>
                  Sécuriser les <span style={{ color: '#191970' }}>systèmes & données</span> en 2026
                </>
              ) : (
                formation.heroTitle
              )}
            </h1>

            {/* Description — centrée */}
            <p
              className="text-center mx-auto"
              style={{
                marginTop: 'clamp(18px, 2.5vh, 28px)',
                fontSize: 'clamp(16px, 2vw, 20px)',
                lineHeight: 1.75,
                color: 'var(--color-text-secondary)',
                maxWidth: '580px',
              }}
            >
              {formation.description}
            </p>

            <p className="mt-5 text-center text-sm sm:text-base font-semibold text-[#191970]">
              {formation.priceFormatted} · Offre Accès : {formation.paymentOption}
            </p>

            {/* Boutons d'action — centrés */}
            <div
              className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center"
              style={{ marginTop: 'clamp(28px, 4vh, 40px)' }}
            >
              <button
                onClick={handleStartParcours}
                className="m-btn-primary w-full sm:w-auto transition-transform duration-200 hover:scale-[1.01]"
              >
                Commencer le parcours
              </button>
              <button
                onClick={handleInscription}
                className="m-btn-secondary w-full sm:w-auto transition-transform duration-200 hover:scale-[1.01]"
              >
                S'inscrire à la formation
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="m-btn-secondary w-full sm:w-auto transition-transform duration-200 hover:scale-[1.01]"
              >
                Nous contacter
              </button>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            2. VISUEL DE LA FORMATION
            ═══════════════════════════════════════════════ */}
        <section
          data-scroll-reveal
          style={{
            backgroundColor: '#FFFFFF',
            padding: 'clamp(24px, 4vw, 48px) 0',
          }}
        >
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
            <h2 className="font-bold mb-4 text-center text-[clamp(26px,6vw,36px)] md:text-[clamp(36px,5vw,44px)] text-[#111827]">
              Pour qui est cette formation ?
            </h2>
            <p className="mb-6 text-center text-sm sm:text-base font-medium text-[#4B5563]">
              À partir de 12 ans
            </p>
            <div className="flex w-full items-center justify-center gap-2 sm:gap-4">
              <div className="relative flex w-1/2 max-w-[300px] items-center justify-center md:w-1/4 md:max-w-[300px]">
                <picture className="hidden md:block">
                  <img src="/eleve_formation.webp" alt="Élève en formation" className="block h-auto w-full" />
                </picture>
                <div className="relative block w-full md:hidden">
                  <img
                    src="/eleve_formation.webp"
                    alt="Élève en formation"
                    className={`block h-auto w-full transition-all duration-700 ease-in-out ${showAlternateAudience ? 'translate-y-3 opacity-0' : 'translate-y-0 opacity-100'}`}
                  />
                  <img
                    src="/zemidjan_formation.webp"
                    alt="Conducteur de zem en formation"
                    className={`absolute inset-0 h-full w-full object-contain transition-all duration-700 ease-in-out ${showAlternateAudience ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                  />
                </div>
              </div>
              <div className="relative flex w-1/2 max-w-[300px] items-center justify-center md:w-1/4 md:max-w-[300px]">
                <picture className="hidden md:block">
                  <img src="/entrepreneur_formation.webp" alt="Entrepreneur en formation" className="block h-auto w-full" />
                </picture>
                <div className="relative block w-full md:hidden">
                  <img
                    src="/entrepreneur_formation.webp"
                    alt="Entrepreneur en formation"
                    className={`block h-auto w-full transition-all duration-700 ease-in-out ${showAlternateAudience ? 'translate-y-3 opacity-0' : 'translate-y-0 opacity-100'}`}
                  />
                  <img
                    src="/maman_formation.webp"
                    alt="Maman en formation"
                    className={`absolute inset-0 h-full w-full object-contain transition-all duration-700 ease-in-out ${showAlternateAudience ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                  />
                </div>
              </div>
              <div className="hidden relative w-1/2 max-w-[300px] items-center justify-center md:flex md:w-1/4">
                <img
                  src="/zemidjan_formation.webp"
                  alt="Conducteur de zem en formation"
                  className="block h-auto w-full"
                />
              </div>
              <div className="hidden relative w-1/2 max-w-[300px] items-center justify-center md:flex md:w-1/4">
                <img
                  src="/maman_formation.webp"
                  alt="Maman en formation"
                  className="block h-auto w-full"
                />
              </div>
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/search-profiles')}
                className="m-btn-primary w-full sm:w-auto transition-transform duration-200 hover:scale-[1.01]"
              >
                Rencontrez nos élèves
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            3. PRÉREQUIS
            ═══════════════════════════════════════════════ */}
        <section
          data-scroll-reveal
          style={{
            backgroundColor: '#FAFAFA',
            paddingTop: 'clamp(40px, 6vh, 64px)',
            paddingBottom: 'clamp(40px, 6vh, 64px)',
          }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-bold mb-5 text-center text-[clamp(26px,6vw,36px)] md:text-[clamp(36px,5vw,44px)] text-[#111827]">
                Prérequis
              </h2>
              <ul className="mx-auto max-w-2xl space-y-3">
                {formation.prerequisites.map((prerequisite) => (
                  <li
                    key={prerequisite}
                    className="border-b border-[#E5E7EB] py-3 text-center text-sm sm:text-base text-[#374151]"
                  >
                    {prerequisite}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            4. PROGRAMME / SYLLABUS (5 MODULES ÉPURÉS)
            ═══════════════════════════════════════════════ */}
        <section
          data-scroll-reveal
          style={{
            backgroundColor: '#FFFFFF',
            paddingTop: 'clamp(40px, 6vh, 64px)',
            paddingBottom: 'clamp(40px, 6vh, 64px)',
          }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12">
              <p
                className="text-xs uppercase font-semibold tracking-[0.2em] mb-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                PROGRAMME
              </p>
              <h2
                className="font-bold text-2xl sm:text-3xl"
                style={{ color: '#111827', letterSpacing: '-0.02em' }}
              >
                Syllabus de la formation ({formation.duration})
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {formation.modules.map((mod) => (
                <div
                  key={mod.number}
                  className="bg-[#FAFAFA] p-4 sm:p-6 rounded-2xl border border-[#E5E7EB]"
                  style={{ boxShadow: '0 2px 8px rgba(15,23,42,0.03)' }}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <span
                      className="font-bold text-xs sm:text-sm px-2.5 py-1 sm:px-3 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: '#191970', color: '#FFFFFF' }}
                    >
                      {mod.number}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-[#111827] mb-1">{mod.title}</h3>
                      <p className="text-sm text-[#4B5563] leading-relaxed">{mod.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA bas de page */}
            <div className="mt-10 sm:mt-12 text-center">
              <button
                onClick={handleStartParcours}
                className="m-btn-primary w-full sm:w-auto transition-transform duration-200 hover:scale-[1.01]"
              >
                Commencer le parcours
              </button>
            </div>
          </div>
        </section>

        <section
          data-scroll-reveal
          style={{
            backgroundColor: '#FAFAFA',
            paddingTop: 'clamp(36px, 5vh, 56px)',
            paddingBottom: 'clamp(36px, 5vh, 56px)',
          }}
        >
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mx-auto mb-10 text-center">
              <p className="text-xs uppercase font-semibold tracking-[0.2em] mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                PARCOURS
              </p>
              <h2 className="font-bold text-[clamp(28px,6vw,40px)] text-[#111827]" style={{ letterSpacing: '-0.02em' }}>
                Ton parcours d’apprentissage
              </h2>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {(formation.roadmap || []).map((block, index) => (
                <div key={block.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#191970] text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-[#111827]">{block.title}</h3>
                        <p className="text-sm text-[#4B5563] mt-1">{block.objective}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7280]">{block.duration}</span>
                      <button
                        onClick={handleStartParcours}
                        className="px-4 py-2 text-sm font-semibold rounded-xl bg-[#191970] text-white"
                      >
                        Ouvrir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default FormationDetail;
