import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/* ============================================================
   TYPES
   ============================================================ */

/* ============================================================
   SECTION 1 — HERO
   ============================================================ */

// Contenu qui change selon le type de business tapé dans l'URL
const DOMAIN_PROFILES = [
  {
    url: 'www.mabo',
    accent: '#191970',
    lines: ['w-5/6', 'w-4/6', 'w-2/3'],
  },
  {
    url: 'www.monrestaurant.com',
    accent: '#F97316',
    lines: ['w-4/6', 'w-full', 'w-3/6'],
  },
  {
    url: 'www.maboutique.com',
    accent: '#7C3AED',
    lines: ['w-full', 'w-2/6', 'w-5/6'],
  },
];

function HeroSection() {
  const [visible] = useState(true);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mq.matches);
    updatePreference();
    mq.addEventListener('change', updatePreference);
    return () => mq.removeEventListener('change', updatePreference);
  }, []);

  const [typedUrl, setTypedUrl] = useState('');
  const [profileIndex, setProfileIndex] = useState(0);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setTypedUrl(DOMAIN_PROFILES[0].url);
      return;
    }

    let domainIndex = 0;
    let charIndex = 0;
    let phase: 'typing' | 'pausing' | 'clicking' | 'loading' | 'deleting' = 'typing';
    let timeoutId: ReturnType<typeof setTimeout>;

    const TYPE_SPEED = 72;
    const DELETE_SPEED = 36;
    const PAUSE_AFTER_TYPE = 900;
    const CLICK_DURATION = 500;
    const LOADING_DURATION = 550;
    const PAUSE_AFTER_DELETE = 250;

    const tick = () => {
      const currentText = DOMAIN_PROFILES[domainIndex].url;

      if (phase === 'typing') {
        charIndex += 1;
        setTypedUrl(currentText.slice(0, charIndex));

        if (charIndex >= currentText.length) {
          phase = 'pausing';
          timeoutId = setTimeout(tick, PAUSE_AFTER_TYPE);
        } else {
          timeoutId = setTimeout(tick, TYPE_SPEED);
        }
      } else if (phase === 'pausing') {
        phase = 'clicking';
        setIsClicking(true);
        timeoutId = setTimeout(tick, CLICK_DURATION);
      } else if (phase === 'clicking') {
        setIsClicking(false);
        phase = 'loading';
        setIsLoadingPage(true);
        timeoutId = setTimeout(tick, LOADING_DURATION);
      } else if (phase === 'loading') {
        setIsLoadingPage(false);
        setProfileIndex(domainIndex);
        phase = 'deleting';
        timeoutId = setTimeout(tick, 1400);
      } else {
        charIndex -= 1;
        setTypedUrl(currentText.slice(0, Math.max(charIndex, 0)));
        if (charIndex <= 0) {
          domainIndex = (domainIndex + 1) % DOMAIN_PROFILES.length;
          phase = 'typing';
          timeoutId = setTimeout(tick, PAUSE_AFTER_DELETE);
        } else {
          timeoutId = setTimeout(tick, DELETE_SPEED);
        }
      }
    };

    timeoutId = setTimeout(tick, TYPE_SPEED);
    return () => clearTimeout(timeoutId);
  }, [prefersReducedMotion]);

  const navigate = useNavigate();
  const activeProfile = DOMAIN_PROFILES[profileIndex];

  return (
    <section
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        minHeight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 'clamp(88px, 14vh, 132px) 0 20px',
      }}
    >
      <div className="relative">
        <div
          className="absolute inset-0 z-0 cursor-pointer"
          role="link"
          aria-label="Voir le site vitrine"
          onClick={() => navigate('/siteweb/vitrine')}
        />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12 w-full flex flex-wrap items-center justify-center gap-6 md:justify-between md:flex-nowrap pointer-events-none">
          <div
            className="w-full min-w-[280px] max-w-[520px] text-left"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(18px)',
            transition: 'all 700ms ease-out',
            position: 'relative',
            zIndex: 0,
          }}
        >
          <div className="mb-5 sm:mb-6 xl:mb-7" style={{ maxWidth: '520px', marginInline: '0' }}>
            <p className="text-sm uppercase tracking-[0.26em] text-[var(--color-text-secondary)] mb-4 text-center">Offre ACCÈS</p>
            <h1
              className="font-bold"
              style={{
                fontSize: 'clamp(32px, 7vw, 58px)',
                lineHeight: 1.06,
                letterSpacing: '-0.04em',
                color: 'var(--color-text-primary)',
                maxWidth: 'min(520px, 100vw)',
                overflowWrap: 'normal',
                wordBreak: 'keep-all',
                whiteSpace: 'normal',
              }}
            >
              <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Obtenez votre</span>
              <span style={{ display: 'block', color: 'var(--color-brand)', whiteSpace: 'nowrap' }}>site web. Payez</span>
              <span style={{ display: 'block', color: 'var(--color-brand)', whiteSpace: 'nowrap' }}>progressivement.</span>
            </h1>
          </div>

          <div className="mb-6 space-y-3 xl:mb-8">
            <p
              className="font-semibold"
              style={{
                fontSize: 'clamp(18px, 2.2vw, 26px)',
                lineHeight: 1.25,
                letterSpacing: '-0.01em',
                color: 'var(--color-brand)',
              }}
            >
              À partir de <span className="font-bold">75 000 FCFA</span>.
            </p>
            <p
              className="font-medium"
              style={{
                fontSize: 'clamp(14px, 1.9vw, 18px)',
                lineHeight: 1.8,
                color: 'var(--color-text-secondary)',
              }}
            >
              Jusqu'à 6 mois de paiement échelonnés.
            </p>
          </div>

          <div className="md:hidden w-full max-w-[460px] mx-auto overflow-hidden rounded-[28px] border border-[#E5E7EB] bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] mb-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E5E7EB]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#F87171]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#34D399]" />
              <div className="flex-1 min-w-0 rounded-full bg-[#F8FAFC] px-4 py-3 border border-[#E5E7EB] text-sm font-medium text-[#111827] relative overflow-hidden">
                <span
                  key={activeProfile.url}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: activeProfile.accent,
                    animation: prefersReducedMotion ? 'none' : 'favicon-pop 400ms ease-out',
                  }}
                />
                <span className="block truncate pl-[30px]">
                  <span style={{ color: '#6B7280', marginRight: '2px' }}>https://</span>
                  {typedUrl}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start pointer-events-auto">
            <Link to="/siteweb/vitrine" className="m-btn-secondary relative z-20 transition-transform duration-200 hover:scale-105 hover:shadow-xl">
              En savoir plus
              <ArrowRight size={16} />
            </Link>
            <Link to="/siteweb/vitrine" className="m-btn-primary relative z-20 transition-transform duration-200 hover:scale-105 hover:shadow-xl">
              Commander
            </Link>
          </div>
        </div>

        <div className="hidden md:block relative w-full min-w-[280px] max-w-[520px] mx-auto overflow-visible mt-6 md:mt-0">
          <style>{`
            @keyframes blink-cursor {
              0%, 50%, 100% { opacity: 1; }
              25%, 75% { opacity: 0; }
            }
            @keyframes favicon-pop {
              0% { transform: scale(0.4); opacity: 0; }
              60% { transform: scale(1.15); opacity: 1; }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes bar-fade-in {
              0% { opacity: 0; transform: translateY(3px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes loading-sweep {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>

          <div
            className="w-full overflow-hidden rounded-[32px] bg-[#F8FAFC] shadow-[0_30px_90px_rgba(15,23,42,0.16)] p-5 sm:p-6"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(48px)',
              transition: 'all 800ms ease-out',
              transitionDelay: '120ms',
            }}
          >
            <div className="rounded-[28px] border border-[#E5E7EB] bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-3 pb-4 border-b border-[#E5E7EB]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#F87171]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#34D399]" />
                <div className="flex-1 min-w-0 rounded-full bg-[#F8FAFC] px-4 py-3 border border-[#E5E7EB] text-sm font-medium text-[#111827] relative overflow-hidden">
                  <span
                    key={activeProfile.url}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: activeProfile.accent,
                      animation: prefersReducedMotion ? 'none' : 'favicon-pop 400ms ease-out',
                    }}
                  />
                  <span className="block truncate pl-[30px]">
                    <span style={{ color: '#6B7280', marginRight: '2px' }}>https://</span>
                    {typedUrl}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-3 relative overflow-hidden" style={{ minHeight: '4.5rem' }}>
                {isLoadingPage && !prefersReducedMotion && (
                  <div
                    className="absolute inset-0 rounded-md"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(25,25,112,0.08), transparent)',
                      animation: 'loading-sweep 550ms ease-in-out',
                    }}
                  />
                )}
                {activeProfile.lines.map((width, i) => (
                  <div
                    key={`${activeProfile.url}-${i}`}
                    className={`h-3 rounded-full ${width}`}
                    style={{
                      backgroundColor: i === 0 ? `${activeProfile.accent}33` : '#E5E7EB',
                      animation: prefersReducedMotion ? 'none' : `bar-fade-in 350ms ease-out ${i * 60}ms both`,
                    }}
                  />
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-24 rounded-full bg-[#E5E7EB]" />
                  <div className="h-3 w-32 rounded-full bg-[#E5E7EB]" />
                </div>
                <div
                  className="h-10 rounded-full px-4 flex items-center justify-center text-sm font-semibold text-white"
                  style={{
                    backgroundColor: activeProfile.accent,
                    transform: isClicking ? 'scale(0.94)' : 'scale(1)',
                    transition: 'transform 160ms ease-out',
                  }}
                >
                  Visiter
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      
    </section>
  );
}

/* ============================================================
   FULLWIDTH CARD SECTION
   ============================================================ */

function FullwidthCardSection({
  to,
  imageSrc,
  imageAlt,
  title,
  description,
  ctaLabel = 'Découvrir',
}: {
  to: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  ctaLabel?: string;
}) {
  return (
    <section
      data-scroll-reveal
      style={{ backgroundColor: '#FAFAFA', paddingTop: 'clamp(30px, 4vh, 60px)', paddingBottom: 'clamp(30px, 4vh, 60px)' }}
    >
      <div className="w-full">
        <Link
          to={to}
          className="group block w-full overflow-hidden bg-[#FAFAFA] shadow-[0_24px_60px_rgba(15,23,42,0.08)] transition-shadow duration-500 hover:shadow-[0_28px_80px_rgba(15,23,42,0.14)]"
        >
          <div className="px-6 py-8 md:px-8 md:py-10 text-center relative z-10">
            <h2 className="font-bold mb-3 text-[clamp(28px,6vw,36px)] md:text-[clamp(36px,5vw,44px)]" style={{ color: '#111827', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
              {title}
            </h2>
            <p className="text-sm md:text-base mx-auto" style={{ lineHeight: 1.6, color: '#000000', maxWidth: '520px' }}>
              {description}
            </p>
            <div
              className="relative z-10 mt-6 inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#191970] px-6 py-3 font-semibold text-white transition-all duration-200 group-hover:scale-105"
              style={{ fontSize: '14px' }}
            >
              {ctaLabel}
            </div>
          </div>

          <div className="relative w-full h-[340px] bg-[#F8FAFC] overflow-hidden -mt-12 md:-mt-20">
            <img
              src={imageSrc}
              alt={imageAlt}
              loading="lazy"
              width="1600"
              height="900"
              className="w-full h-full object-contain object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 2 — MIDEESSI SERVICES
   ============================================================ */

function ServicesSection() {
  return (
    <FullwidthCardSection
      to="/solutions"
      imageSrc="/mideessi_services.webp"
      imageAlt="Illustration de services numériques MIDEESSI"
      title="Développez vos activités"
      description="Le numérique au cœur de vos activités pour être plus visible et plus performant."
    />
  );
}

function TrustBarSection() {
  const logos = ['NOVA', 'LUMA', 'ORBIT'];

  return (
    <section
      data-scroll-reveal
      style={{
        backgroundColor: '#FAFAFA',
        paddingTop: 'clamp(18px, 2vh, 28px)',
        paddingBottom: 'clamp(18px, 2vh, 28px)',
      }}
    >
      <div className="w-full px-0">
        <div className="px-5 py-6 md:px-12 md:py-8" style={{ backgroundColor: '#F5F5F7' }}>
          <p
            className="text-center uppercase tracking-[0.22em]"
            style={{ fontSize: '11px', color: '#5E6472', letterSpacing: '0.18em' }}
          >
            Nous les avons aidés
          </p>

          <div className="mt-5 flex gap-2 md:gap-4">
            {logos.map((logo) => (
              <div
                key={logo}
                className="flex min-w-0 flex-1 items-center justify-center px-2 py-3 md:px-4 md:py-5"
                style={{
                  backgroundColor: '#ECEEF4',
                  color: 'rgba(17, 17, 17, 0.38)',
                  fontSize: 'clamp(14px, 3vw, 30px)',
                  fontWeight: 700,
                  letterSpacing: '-0.08em',
                }}
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 3 — MIDEESSI LEARN
   ============================================================ */

function LearnSection() {
  return (
    <FullwidthCardSection
      to="/apprendre"
      imageSrc="/mideessi_learn.webp"
      imageAlt="Illustration d’apprentissage numérique MIDEESSI"
      title="Formations et Livres"
      description="Accédez à des connaissances qui vous correspondent et vous font évoluer"
      ctaLabel="Apprendre"
    />
  );
}

/* ============================================================
   SECTION 4 — MIDEESSI LABS
   ============================================================ */

function LabsSection() {
  return (
    <FullwidthCardSection
      to="/laboratoire"
      imageSrc="/mideessi_labs.webp"
      imageAlt="Illustration MIDEESSI Labs"
      title="Nos Innovations Maison"
      description="Découvrez nos solutions développées par notre équipe. Devenez bêta-testeur."
    />
  );
}

/* ============================================================
   SECTION 5 — CONTACT
   ============================================================ */

export default function NewHome() {
  useEffect(() => {
    const revealItems = document.querySelectorAll('[data-scroll-reveal]');

    if (!revealItems.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -20px 0px',
      }
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

      <div style={{ backgroundColor: '#FAFAFA' }}>
        <HeroSection />
        <div className="mx-auto h-[20px] w-full bg-white" style={{ margin: '0 0 1px 0' }} />
        <ServicesSection />
        <TrustBarSection />
        <div className="mx-auto h-[20px] w-full bg-white" style={{ margin: '0 0 1px 0' }} />
        <LearnSection />
        <div className="mx-auto h-[20px] w-full bg-white" style={{ margin: '0 0 1px 0' }} />
        <LabsSection />
      </div>
    </>
  );
}
