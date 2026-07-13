import { Home, Tag, GraduationCap, Library, Grid3X3 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useNavigation } from '../contexts/NavigationContext';

interface BottomNavItem {
  label: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}

const navItems: BottomNavItem[] = [
  { label: 'Accueil',  href: '/',         icon: Home },
  { label: 'Offres',   href: '/offres',   icon: Tag },
  { label: 'Ateliers', href: '/ateliers', icon: GraduationCap },
  { label: 'Biblio',   href: '/library',  icon: Library },
];

const BottomNavigation = () => {
  const location = useLocation();
  const { setShowDrawer } = useNavigation();

  const isActive = (href: string) =>
    href === '/'
      ? location.pathname === '/'
      : location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <>
      {/* ── Bottom Navigation Bar (mobile only) ── */}
      <nav
        aria-label="Navigation principale"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Frosted-glass pill */}
        <div className="mx-3 mb-3">
          <div className="
            relative flex items-stretch
            rounded-[26px]
            bg-white/90 dark:bg-[#0d0d2e]/90
            backdrop-blur-2xl
            border border-white/60 dark:border-white/10
            shadow-[0_8px_32px_-8px_rgba(25,25,112,0.25),0_2px_8px_-2px_rgba(0,0,0,0.12)]
            px-2 py-1.5
            overflow-hidden
          ">
            {/* Subtle gold top-edge glow */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-[20%] top-0 h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-gold/60 to-transparent"
            />

            {/* Nav items */}
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = isActive(href);
              return (
                <a
                  key={href}
                  href={href}
                  className="relative flex flex-1 flex-col items-center justify-center gap-[3px] py-2 px-1 select-none"
                  aria-current={active ? 'page' : undefined}
                >
                  {/* Active background pill */}
                  {active && (
                    <span className="absolute inset-x-1 inset-y-0.5 rounded-[18px] bg-gradient-to-b from-[#FFD700]/20 to-[#FFD700]/8" />
                  )}

                  {/* Icon wrapper */}
                  <span
                    className={`
                      relative z-10 flex items-center justify-center
                      w-8 h-8 rounded-2xl
                      transition-all duration-300
                      ${active
                        ? 'bg-gradient-to-br from-[#FFD700]/25 to-[#FFD700]/10 shadow-[0_0_12px_rgba(255,215,0,0.4)] scale-110'
                        : 'bg-transparent scale-100'
                      }
                    `}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] transition-all duration-300 ${
                        active
                          ? 'text-[#FFD700] drop-shadow-[0_0_6px_rgba(255,215,0,0.7)]'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    />

                  </span>

                  {/* Label */}
                  <span
                    className={`relative z-10 text-[10px] font-semibold tracking-wide transition-all duration-300 leading-none ${
                      active ? 'text-[#FFD700]' : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {label}
                  </span>
                </a>
              );
            })}

            {/* Separator */}
            <span className="my-3 w-px flex-shrink-0 bg-gray-200/60 dark:bg-white/10" />

            {/* "Plus" button */}
            <button
              onClick={() => setShowDrawer(true)}
              aria-label="Ouvrir le menu"
              className="relative flex flex-1 flex-col items-center justify-center gap-[3px] py-2 px-1 select-none group"
            >
              <span className="
                relative z-10 flex items-center justify-center
                w-8 h-8 rounded-2xl
                bg-[#191970]/6 dark:bg-white/5
                group-hover:bg-[#191970]/12 dark:group-hover:bg-white/10
                group-active:scale-90
                transition-all duration-300
              ">
                <Grid3X3 className="w-[18px] h-[18px] text-gray-400 dark:text-gray-500 group-hover:text-[#191970] dark:group-hover:text-gold group-active:text-[#191970] dark:group-active:text-gold transition-colors duration-200" />
              </span>
              <span className="relative z-10 text-[10px] font-semibold tracking-wide leading-none text-gray-400 dark:text-gray-500 group-hover:text-[#191970] dark:group-hover:text-gold group-active:text-[#191970] dark:group-active:text-gold transition-colors duration-200">
                Plus
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind nav */}
      <div className="h-[5.5rem] md:h-0 md:hidden" aria-hidden />
    </>
  );
};

export default BottomNavigation;
