import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { getRoute } from '../utils/routes';

/* ── Custom 3D-style SVG icons ── */
const IconHome = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="home-roof" x1="12" y1="2" x2="12" y2="11" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={active ? '#2a2fa0' : '#6B7280'} />
        <stop offset="100%" stopColor={active ? '#191970' : '#9CA3AF'} />
      </linearGradient>
      <linearGradient id="home-wall" x1="12" y1="11" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={active ? '#3d42b8' : '#9CA3AF'} />
        <stop offset="100%" stopColor={active ? '#191970' : '#6B7280'} />
      </linearGradient>
    </defs>
    {/* Roof */}
    <path d="M3 12L12 3L21 12" stroke="url(#home-roof)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Shadow face right */}
    <path d="M18.5 8.5V21H21V12L18.5 8.5Z" fill={active ? '#0f1450' : '#D1D5DB'} opacity="0.5" />
    {/* Wall */}
    <path d="M5 11V21H19V11" fill="url(#home-wall)" opacity="0.15" />
    <path d="M5 11V21H19V11" stroke="url(#home-wall)" strokeWidth="1.8" strokeLinejoin="round" />
    {/* Door */}
    <rect x="9" y="15" width="6" height="6" rx="1"
      fill={active ? '#FFD700' : '#E5E7EB'}
      stroke={active ? '#e6c000' : '#D1D5DB'} strokeWidth="0.8" />
    {/* Door knob */}
    <circle cx="14" cy="18" r="0.8" fill={active ? '#191970' : '#9CA3AF'} />
  </svg>
);

const IconServices = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="brief-top" x1="4" y1="6" x2="20" y2="6" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={active ? '#3d42b8' : '#9CA3AF'} />
        <stop offset="100%" stopColor={active ? '#191970' : '#6B7280'} />
      </linearGradient>
      <linearGradient id="brief-body" x1="4" y1="8" x2="20" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={active ? '#4a50cc' : '#D1D5DB'} />
        <stop offset="100%" stopColor={active ? '#191970' : '#9CA3AF'} />
      </linearGradient>
    </defs>
    {/* Body */}
    <rect x="3" y="9" width="18" height="13" rx="2" fill="url(#brief-body)" opacity="0.18" />
    <rect x="3" y="9" width="18" height="13" rx="2" stroke="url(#brief-body)" strokeWidth="1.8" />
    {/* Top edge highlight */}
    <rect x="3" y="9" width="18" height="2.5" rx="1.5" fill="url(#brief-top)" opacity="0.3" />
    {/* Handle */}
    <path d="M9 9V7C9 5.9 9.9 5 11 5H13C14.1 5 15 5.9 15 7V9"
      stroke={active ? '#191970' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" />
    {/* Centre line */}
    <line x1="3" y1="15" x2="21" y2="15" stroke={active ? '#FFD700' : '#D1D5DB'} strokeWidth="1.4" />
    {/* Clasp */}
    <rect x="10.5" y="13.5" width="3" height="3" rx="0.8"
      fill={active ? '#FFD700' : '#E5E7EB'} stroke={active ? '#e6c000' : '#D1D5DB'} strokeWidth="0.7" />
  </svg>
);

const IconLearn = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="book-cover" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={active ? '#3d42b8' : '#9CA3AF'} />
        <stop offset="100%" stopColor={active ? '#191970' : '#6B7280'} />
      </linearGradient>
    </defs>
    {/* Book shadow / depth */}
    <path d="M6 5H19C19.6 5 20 5.4 20 6V20C20 20.6 19.6 21 19 21H6"
      fill={active ? '#0f1450' : '#E5E7EB'} opacity="0.25" />
    {/* Back cover */}
    <rect x="5" y="3" width="14" height="18" rx="2"
      fill="url(#book-cover)" opacity="0.12" />
    <rect x="5" y="3" width="14" height="18" rx="2"
      stroke="url(#book-cover)" strokeWidth="1.8" />
    {/* Spine */}
    <line x1="9" y1="3" x2="9" y2="21" stroke={active ? '#191970' : '#9CA3AF'} strokeWidth="2" />
    <rect x="5" y="3" width="4" height="18" rx="1.5"
      fill={active ? '#191970' : '#9CA3AF'} opacity="0.2" />
    {/* Lines (pages) */}
    <line x1="12" y1="8" x2="17" y2="8" stroke={active ? '#FFD700' : '#D1D5DB'} strokeWidth="1.4" strokeLinecap="round" />
    <line x1="12" y1="11.5" x2="17" y2="11.5" stroke={active ? '#9CA3AF' : '#E5E7EB'} strokeWidth="1.1" strokeLinecap="round" opacity="0.8" />
    <line x1="12" y1="15" x2="17" y2="15" stroke={active ? '#9CA3AF' : '#E5E7EB'} strokeWidth="1.1" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const IconLabs = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="flask-body" x1="8" y1="10" x2="18" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={active ? '#4a50cc' : '#D1D5DB'} />
        <stop offset="100%" stopColor={active ? '#191970' : '#9CA3AF'} />
      </linearGradient>
    </defs>
    {/* Tube */}
    <path d="M9 3H15" stroke={active ? '#191970' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" />
    {/* Flask outline */}
    <path d="M10 3V10L5.5 18C5 19 5.5 21 7.5 21H16.5C18.5 21 19 19 18.5 18L14 10V3"
      stroke="url(#flask-body)" strokeWidth="1.8" strokeLinejoin="round" />
    {/* Liquid fill */}
    <path d="M6.5 17C7.5 15.5 10 15 12 16C14 17 16.5 16.5 17.5 15.5L18.5 18C19 19 18.5 21 16.5 21H7.5C5.5 21 5 19 5.5 18L6.5 17Z"
      fill={active ? '#191970' : '#D1D5DB'} opacity={active ? 0.25 : 0.2} />
    {/* Bubbles */}
    <circle cx="10" cy="18" r="1.2" fill={active ? '#FFD700' : '#E5E7EB'} opacity="0.9" />
    <circle cx="13.5" cy="17" r="0.8" fill={active ? '#FFD700' : '#E5E7EB'} opacity="0.7" />
    <circle cx="15" cy="19" r="0.6" fill={active ? '#FFD700' : '#E5E7EB'} opacity="0.5" />
    {/* Shine */}
    <path d="M11 12L10 15" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
  </svg>
);

interface BottomNavItem {
  label: string;
  href: string;
  Icon3D: React.FC<{ active: boolean }>;
}

const navItems: BottomNavItem[] = [
  { label: 'Accueil',   href: getRoute.home(),           Icon3D: IconHome },
  { label: 'Services',  href: getRoute.solutions(),  Icon3D: IconServices },
  { label: 'Apprendre', href: getRoute.apprendre(),  Icon3D: IconLearn },
  { label: 'Labs',      href: getRoute.laboratoire(),Icon3D: IconLabs },
];


const BottomNavigation = () => {
  const location = useLocation();
  const { bottomNavHidden, setBottomNavHidden } = useNavigation();

  const [hidden, setHidden] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches) {
      return true;
    }
    return bottomNavHidden;
  });
  const [showHoldHint, setShowHoldHint] = useState(false);
  const [showRevealHint, setShowRevealHint] = useState(false);
  const startX = useRef<number | null>(null);
  const dragging = useRef(false);
  const holdTimer = useRef<number | null>(null);

  useEffect(() => {
    setBottomNavHidden(hidden);
  }, [hidden, setBottomNavHidden]);

  useEffect(() => {
    if (hidden || !window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches) return;
    const timer = window.setTimeout(() => setHidden(true), 5000);
    return () => window.clearTimeout(timer);
  }, [hidden]);

  useEffect(() => {
    if (!hidden) {
      setShowRevealHint(false);
      return undefined;
    }

    setShowRevealHint(true);
    const timer = window.setTimeout(() => setShowRevealHint(false), 3200);
    return () => window.clearTimeout(timer);
  }, [hidden]);

  const isActive = (href: string) =>
    href === '/'
      ? location.pathname === '/'
      : location.pathname === href || location.pathname.startsWith(href + '/');

  // Touch / swipe handlers (left swipe to hide)
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    dragging.current = true;
    // start hold timer
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => {
      setShowHoldHint(true);
    }, 600) as unknown as number;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current || startX.current === null) return;
    const currentX = e.touches[0].clientX;
    const dx = currentX - startX.current;
    // any significant move cancels the hold hint timer
    if (Math.abs(dx) > 12 && holdTimer.current) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
      setShowHoldHint(false);
    }
    // swipe right -> dx positive
    if (dx > 60) {
      setHidden(true);
      setShowHoldHint(false);
      dragging.current = false;
    }
    if (dx < -80) {
      setHidden(false);
      setShowHoldHint(false);
      dragging.current = false;
    }
  };

  const onTouchEnd = () => {
    dragging.current = false;
    startX.current = null;
    if (holdTimer.current) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    setShowHoldHint(false);
  };

  // Basic mouse support for quick testing on desktop
  const onMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    dragging.current = true;
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => setShowHoldHint(true), 600) as unknown as number;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 12 && holdTimer.current) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
      setShowHoldHint(false);
    }
    if (dx > 60) {
      setHidden(true);
      setShowHoldHint(false);
      dragging.current = false;
    }
    if (dx < -80) {
      setHidden(false);
      setShowHoldHint(false);
      dragging.current = false;
    }
  };
  const onMouseUp = () => {
    dragging.current = false;
    startX.current = null;
    if (holdTimer.current) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    setShowHoldHint(false);
  };

  return (
    <>
      <style>{`
        @keyframes bottom-nav-handle-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <nav
        aria-label="Navigation principale"
        className={`fixed inset-x-0 bottom-0 z-40 box-border overflow-hidden md:inset-x-auto md:bottom-auto md:left-auto md:right-4 md:top-1/2 md:w-[84px] md:max-w-[84px] md:-translate-y-1/2 lg:hidden transform transition-transform duration-500 ease-in-out ${hidden ? 'translate-x-full md:!translate-x-[calc(100%+1rem)]' : 'translate-x-0'}`}
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <div className="mx-3 mb-2 box-border overflow-hidden rounded-[1.5rem] border border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_-6px_24px_rgba(17,17,17,0.08)] supports-[backdrop-filter]:bg-white/60 md:mx-0 md:mb-0">
          <div className="grid grid-cols-4 items-center gap-1 px-1 py-1 md:grid-cols-1 md:gap-2 md:py-2">
            {navItems.map(({ label, href, Icon3D }) => {
              const active = isActive(href);

              return (
                <Link
                  key={href}
                  to={href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex min-h-[48px] flex-col items-center justify-center gap-0 rounded-[1.1rem] px-1 py-0 transition-all duration-200 hover:bg-white/50 md:min-h-[68px] md:gap-1 md:py-2`}
                >
                  <span
                    className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                      active ? 'bg-[#F3F4F6]' : 'bg-transparent'
                    }`}
                    style={active ? { boxShadow: '0 2px 8px rgba(25,25,112,0.10)' } : {}}
                  >
                    <Icon3D active={active} />
                  </span>

                  <span
                    className={`relative z-10 text-[10px] font-semibold tracking-[0.08em] uppercase transition-colors duration-200 ${
                      active ? 'text-[#191970]' : 'text-[#4B5563]'
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Hold hint shown when user long-presses on the nav */}
      {showHoldHint && !hidden && (
        <div className="fixed left-1/2 bottom-20 z-50 -translate-x-1/2">
          <div className="bg-[#111827] text-white text-sm px-4 py-2 rounded-full shadow-md opacity-95">
            Balayez vers la gauche pour masquer
          </div>
        </div>
      )}

      {/* Reveal handle when hidden: small barely-visible tab at left edge */}
      {hidden && (
        <>
          {showRevealHint && (
            <div
              role="status"
              className="fixed bottom-20 left-4 z-50 max-w-[220px] animate-fade-in rounded-2xl bg-[#191970] px-4 py-3 text-xs font-semibold leading-snug text-white shadow-[0_10px_24px_rgba(25,25,112,0.24)]"
            >
              Touchez la languette pour réafficher le menu
              <span className="absolute -bottom-1 left-5 h-3 w-3 rotate-45 bg-[#191970]" aria-hidden />
            </div>
          )}
          <button
            aria-label="Afficher la navigation"
            onClick={() => setHidden(false)}
            onTouchStart={(e) => { startX.current = e.touches[0].clientX; dragging.current = true; }}
            onTouchMove={(e) => {
              if (!dragging.current || startX.current === null) return;
              const dx = e.touches[0].clientX - startX.current;
              if (dx > 30) {
                setHidden(false);
                dragging.current = false;
              }
            }}
            onTouchEnd={() => { dragging.current = false; startX.current = null; }}
            onMouseDown={(e) => { startX.current = e.clientX; dragging.current = true; }}
            onMouseMove={(e) => {
              if (!dragging.current || startX.current === null) return;
              const dx = e.clientX - startX.current;
              if (dx > 30) {
                setHidden(false);
                dragging.current = false;
              }
            }}
            onMouseUp={() => { dragging.current = false; startX.current = null; }}
            className="fixed bottom-[5rem] left-auto right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-[#191970]/15 bg-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-colors hover:bg-white md:bottom-6 md:right-4"
            style={{ animation: 'bottom-nav-handle-in 420ms cubic-bezier(0.22,1,0.36,1) both' }}
          >
            <ChevronLeft className="h-4 w-4 text-[#191970]" />
          </button>
        </>
      )}

      <div className="h-[3.8rem] md:h-0 lg:hidden" aria-hidden />
    </>
  );
};

export default BottomNavigation;
