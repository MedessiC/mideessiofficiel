import { useEffect } from 'react';

/* ============================================================
   LABORATOIRE PAGE — même design & hiérarchie que NewHome
   ============================================================ */

const Laboratoire = () => {
  useEffect(() => {
    document.title = 'Laboratoire — MIDEESSI';
  }, []);

  /* ── scroll-reveal observer (identique à NewHome) ── */
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

        /* ── Dot pulse ── */
        @keyframes dot-pulse {
          0%, 100% { opacity: 0.25; transform: scale(0.85); }
          50%       { opacity: 1;    transform: scale(1.05); }
        }
        .dot-pulse { animation: dot-pulse 1.8s ease-in-out infinite; }
        .dot-pulse-2 { animation: dot-pulse 1.8s ease-in-out 0.6s infinite; }
        .dot-pulse-3 { animation: dot-pulse 1.8s ease-in-out 1.2s infinite; }
      `}</style>

      <div style={{ backgroundColor: '#FAFAFA' }}>

        {/* ═══════════════════════════════════════════════
            HERO — même rythme que HeroSection de NewHome
            ═══════════════════════════════════════════════ */}
        <section
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: 'clamp(88px, 14vh, 132px) 0 clamp(48px, 6vh, 80px)',
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
              Laboratoire MIDEESSI
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
              <span style={{ display: 'block' }}>Découvrez nos</span>
              <span style={{ display: 'block', color: 'var(--color-brand)' }}>innovations</span>
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
              On repère un problème, on propose des solutions numériques pour le résoudre.
            </p>

            {/* Divider décoratif — même motif dot que NewHome */}
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
            SECTION COMING SOON — pleine largeur comme FullwidthCardSection
            ═══════════════════════════════════════════════ */}
        <section
          data-scroll-reveal
          style={{
            backgroundColor: '#FAFAFA',
            paddingTop: 'clamp(30px, 4vh, 60px)',
            paddingBottom: 'clamp(30px, 4vh, 60px)',
          }}
        >
          <div className="w-full">
            {/* Carte pleine largeur — même shadow & overflow pattern que FullwidthCardSection */}
            <div
              className="w-full overflow-hidden bg-[#FAFAFA]"
              style={{
                boxShadow: '0 24px 60px rgba(15,23,42,0.08)',
              }}
            >
              {/* Header texte de la card */}
              <div
                className="px-6 py-8 md:px-8 md:py-10 text-center relative z-10"
              >
                <h2
                  className="font-bold mb-3"
                  style={{
                    fontSize: 'clamp(28px, 6vw, 36px)',
                    color: '#111827',
                    lineHeight: 1.1,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Revenez ici plus tard
                </h2>
                <p
                  className="text-sm md:text-base mx-auto"
                  style={{ lineHeight: 1.6, color: '#000000', maxWidth: '520px' }}
                >
                  Nos équipes construisent quelque chose.{' '}
                  <span style={{ color: 'var(--color-brand)', fontWeight: 600 }}>
                    Restez à l'écoute.
                  </span>
                </p>
              </div>

              {/* Zone visuelle — même bloc image/illustration que FullwidthCardSection */}
              <div
                className="relative w-full overflow-hidden -mt-12 md:-mt-20"
                style={{
                  height: 'clamp(280px, 38vw, 400px)',
                  backgroundColor: '#F8FAFC',
                }}
              >
                {/* Grille de points — texture fine */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, #D1D5DB 1px, transparent 0)',
                    backgroundSize: '28px 28px',
                    opacity: 0.55,
                  }}
                />

                {/* Illustration centrale */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ gap: '20px' }}
                >
                  {/* Cercles concentriques animés */}
                  <div className="relative flex items-center justify-center" style={{ width: '120px', height: '120px' }}>
                    {[96, 72, 48].map((size, i) => (
                      <div
                        key={size}
                        className="absolute rounded-full border"
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          borderColor: 'var(--color-brand)',
                          opacity: 0.1 + i * 0.08,
                        }}
                      />
                    ))}
                    {/* Icône horloge centrale */}
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 36 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="18" cy="18" r="15" stroke="#191970" strokeWidth="1.8" />
                      <line x1="18" y1="18" x2="18" y2="9" stroke="#191970" strokeWidth="2" strokeLinecap="round" />
                      <line x1="18" y1="18" x2="24" y2="21" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="18" cy="18" r="1.8" fill="#191970" />
                    </svg>
                  </div>

                  {/* Trois points pulsants — loading */}
                  <div className="flex items-center gap-3">
                    <span
                      className="dot-pulse block rounded-full"
                      style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-brand)' }}
                    />
                    <span
                      className="dot-pulse-2 block rounded-full"
                      style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-brand)' }}
                    />
                    <span
                      className="dot-pulse-3 block rounded-full"
                      style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-brand)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Laboratoire;
