import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, UserCircle, LogOut, BookOpen, User, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { Avatar } from './ui/Avatar';
import CommandPalette from './CommandPalette';

/* ── Types ── */
interface DropdownItem {
  label: string;
  description: string;
  href: string;
  highlight?: string;
}

/* ── Data ── */
const mideessiMenu: DropdownItem[] = [
  {
    label: 'Notre mission',
    description: "L'histoire et la raison d'être",
    href: '/about',
  },
  {
    label: 'Notre méthode',
    description: 'Observer → Comprendre → Construire',
    href: '/about#methode',
  },
  {
    label: "L'équipe",
    description: 'Les personnes derrière MIDEESSI',
    href: '/about#team',
  },
  {
    label: 'Nos projets',
    description: 'Les initiatives en cours',
    href: '/projects',
  },
];

const servicesMenu: DropdownItem[] = [
  {
    label: 'Sites web & applications',
    description: 'Création de sites web, applications et boutiques en ligne',
    href: '/siteweb',
  },
  {
    label: 'Réseaux sociaux & événements',
    description: 'Communication digitale, réseaux sociaux et couverture événementnelle',
    href: '/solutions/reseaux-sociaux',
  },
  {
    label: 'Automatisation & IA',
    description: 'Workflows automatisés et outils IA adaptés à vos besoins',
    href: '/solutions/automatisation-ia',
    highlight: 'À partir de 100 000 FCFA',
  },
];

  const apprendreMenu: DropdownItem[] = [
  {
    label: 'Formations',
    description: 'Parcourez nos formations numériques adaptées',
    href: '/apprendre#formations',
  },
  {
    label: 'Livres',
    description: 'Consultez nos ressources et livres numériques',
    href: '/apprendre#livres',
  },
];

/* ── Dropdown Component ── */
function NavDropdown({
  items,
  isOpen,
}: {
  items: DropdownItem[];
  isOpen: boolean;
}) {
  return (
    <div
      className={`absolute top-full left-0 mt-2 w-72 bg-white border border-[#E5E7EB] rounded-xl z-50 overflow-hidden transition-all duration-200 ${
        isOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
    >
      {items.map((item, i) => (
        <div key={item.href + i}>
          <Link
            to={item.href}
            className="block px-5 py-4 hover:bg-[#F3F4F6] transition-colors group"
          >
            <span className="block text-sm font-600 text-[#111111] group-hover:text-[#191970] font-semibold transition-colors">
              {item.label}
            </span>
            <span className="block text-xs text-[#6B7280] mt-0.5">
              {item.description}
            </span>
            {item.highlight && (
              <span className="inline-block mt-2 text-xs font-medium text-[#191970] bg-[#F3F4F6] px-2 py-1 rounded-md">
                {item.highlight}
              </span>
            )}
          </Link>
          {i < items.length - 1 && (
            <div className="h-px bg-[#E5E7EB] mx-5" />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Main Navbar ── */
const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mideessiOpen, setMideessiOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [apprendreOpen, setApprendreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [mobileSearchValue, setMobileSearchValue] = useState('');
  const [mobileSearchPlaceholder, setMobileSearchPlaceholder] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const closeDropdownTimer = useRef<number | null>(null);

  const { user, signOut, currentUserProfile } = useAuth();
  const { setShowDrawer } = useNavigation();

  const mideessiRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const apprendreRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  /* scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen || mobileSearchOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);


  /* close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
    setMobileSearchOpen(false);
    setMobileSearchValue('');
    setMideessiOpen(false);
    setSolutionsOpen(false);
    setApprendreOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileSearchOpen) {
      setMobileSearchPlaceholder('');
      return;
    }

    const examples = ['Site vitrine', 'Formations', 'Réseaux sociaux', 'Automatisation'];
    let exampleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const phrase = examples[exampleIndex];

      if (!deleting) {
        charIndex += 1;
        setMobileSearchPlaceholder(phrase.slice(0, charIndex));

        if (charIndex >= phrase.length) {
          deleting = true;
          timeoutId = setTimeout(tick, 1100);
          return;
        }
      } else {
        charIndex -= 1;
        setMobileSearchPlaceholder(phrase.slice(0, charIndex));

        if (charIndex <= 0) {
          deleting = false;
          exampleIndex = (exampleIndex + 1) % examples.length;
          timeoutId = setTimeout(tick, 180);
          return;
        }
      }

      timeoutId = setTimeout(tick, deleting ? 40 : 90);
    };

    timeoutId = setTimeout(tick, 250);
    return () => clearTimeout(timeoutId);
  }, [mobileSearchOpen]);

  /* click outside to close dropdowns */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (mideessiRef.current && !mideessiRef.current.contains(e.target as Node)) {
        setMideessiOpen(false);
      }
      if (solutionsRef.current && !solutionsRef.current.contains(e.target as Node)) {
        setSolutionsOpen(false);
      }
      if (apprendreRef.current && !apprendreRef.current.contains(e.target as Node)) {
        setApprendreOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* cleanup delayed close timer */
  useEffect(() => {
    return () => {
      if (closeDropdownTimer.current) {
        window.clearTimeout(closeDropdownTimer.current);
      }
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const clearCloseTimer = () => {
    if (closeDropdownTimer.current) {
      window.clearTimeout(closeDropdownTimer.current);
      closeDropdownTimer.current = null;
    }
  };

  const closeDropdowns = () => {
    setMideessiOpen(false);
    setSolutionsOpen(false);
    setApprendreOpen(false);
  };

  const handleDropdownMouseEnter = (dropdown: 'mideessi' | 'solutions' | 'apprendre') => {
    clearCloseTimer();
    closeDropdowns();

    if (dropdown === 'mideessi') setMideessiOpen(true);
    if (dropdown === 'solutions') setSolutionsOpen(true);
    if (dropdown === 'apprendre') setApprendreOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    clearCloseTimer();
    closeDropdownTimer.current = window.setTimeout(() => {
      closeDropdowns();
      closeDropdownTimer.current = null;
    }, 180);
  };

  const navLinkClass = (path: string) =>
    `relative flex items-center gap-1 px-1 py-1 text-sm font-medium transition-colors duration-200 ${
      isActive(path) ? 'text-[#191970]' : 'text-[#111111] hover:text-[#191970]'
    }`;

  return (
    <>
      {/* ── Desktop & Mobile Navbar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA] transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_1px_8px_rgba(0,0,0,0.08)]' : 'border-b border-[#E5E7EB]'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center flex-shrink-0" aria-label="MIDEESSI — Accueil">
              <img
                src="/mideessi-light.webp"
                alt="MIDEESSI"
                className="h-8 w-auto object-contain dark:hidden"
                loading="eager"
                decoding="async"
              />
              <img
                src="/mideessi.webp"
                alt="MIDEESSI"
                className="h-8 w-auto object-contain hidden dark:block"
                loading="eager"
                decoding="async"
              />
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden lg:flex items-center gap-8">

                {/* Services dropdown */}
              <div
                ref={solutionsRef}
                className="relative flex items-center"
                onMouseEnter={() => handleDropdownMouseEnter('solutions')}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <Link to="/solutions" className={navLinkClass('/solutions')}>Services</Link>
                <button
                  onClick={() => {
                    setSolutionsOpen(!solutionsOpen);
                    setMideessiOpen(false);
                    setApprendreOpen(false);
                  }}
                  className="ml-2 p-1 rounded-md hover:bg-[#F3F4F6] transition-colors"
                  aria-expanded={solutionsOpen}
                  aria-label="Ouvrir le menu Services"
                >
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${solutionsOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isActive('/solutions') && (
                  <span className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-[#FFD700]" />
                )}
                <NavDropdown items={servicesMenu} isOpen={solutionsOpen} />
              </div>

              {/* Apprendre dropdown (link primary to /learn) */}
              <div
                ref={apprendreRef}
                className="relative flex items-center"
                onMouseEnter={() => handleDropdownMouseEnter('apprendre')}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <Link to="/apprendre" className={navLinkClass('/apprendre')}>Apprendre</Link>
                <button
                  onClick={() => {
                    setApprendreOpen(!apprendreOpen);
                    setSolutionsOpen(false);
                    setMideessiOpen(false);
                  }}
                  className="ml-2 p-1 rounded-md hover:bg-[#F3F4F6] transition-colors"
                  aria-expanded={apprendreOpen}
                  aria-label="Ouvrir le menu Apprendre"
                >
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${apprendreOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isActive('/apprendre') && (
                  <span className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-[#FFD700]" />
                )}
                <NavDropdown items={apprendreMenu} isOpen={apprendreOpen} />
              </div>

              <div className="relative">
                <Link to="/laboratoire" className={navLinkClass('/laboratoire')}>
                  Laboratoire
                </Link>
                {isActive('/laboratoire') && (
                  <span className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-[#FFD700]" />
                )}
              </div>

              {/* Blog */}
              <div className="relative">
                <Link to="/article" className={navLinkClass('/article')}>
                  Articles
                </Link>
                {isActive('/article') && (
                  <span className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-[#FFD700]" />
                )}
              </div>

              {/* MIDEESSI dropdown */}
              <div
                ref={mideessiRef}
                className="relative flex items-center"
                onMouseEnter={() => handleDropdownMouseEnter('mideessi')}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <Link to="/about" className={navLinkClass('/about')}>
                  MIDEESSI
                </Link>
                <button
                  onClick={() => {
                    setMideessiOpen(!mideessiOpen);
                    setSolutionsOpen(false);
                    setApprendreOpen(false);
                  }}
                  className="ml-2 p-1 rounded-md hover:bg-[#F3F4F6] transition-colors"
                  aria-expanded={mideessiOpen}
                  aria-label="Ouvrir le menu MIDEESSI"
                >
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${mideessiOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isActive('/about') && (
                  <span className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-[#FFD700]" />
                )}
                <NavDropdown items={mideessiMenu} isOpen={mideessiOpen} />
              </div>
            </div>

            {/* ── Right side ── */}
            <div className="flex items-center gap-3">

              {/* User menu */}
              <div ref={userMenuRef} className="relative hidden lg:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                  aria-label="Mon compte"
                >
                  {user && currentUserProfile?.avatar_url ? (
                    <Avatar
                      name={currentUserProfile.username || user.email?.split('@')[0] || 'M'}
                      src={currentUserProfile.avatar_url}
                      size="xs"
                    />
                  ) : (
                    <UserCircle size={20} className="text-[#4B5563]" />
                  )}
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E5E7EB] rounded-xl z-50 overflow-hidden"
                    style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-[#E5E7EB]">
                          <p className="text-xs font-semibold text-[#191970] truncate">
                            {currentUserProfile?.username ? `@${currentUserProfile.username}` : user.email}
                          </p>
                          {currentUserProfile?.username && (
                            <p className="text-xs text-[#6B7280] truncate">{user.email}</p>
                          )}
                        </div>
                        <Link
                          to={`/profile/${currentUserProfile?.username || user.email?.split('@')[0]}`}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-[#111111] hover:bg-[#F3F4F6] transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User size={16} className="text-[#4B5563]" />
                          Mon Profil
                        </Link>
                        <Link
                          to="/my-library"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-[#111111] hover:bg-[#F3F4F6] transition-colors border-b border-[#E5E7EB]"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <BookOpen size={16} className="text-[#4B5563]" />
                          Ma Bibliothèque
                        </Link>
                        <button
                          onClick={async () => { await signOut(); setUserMenuOpen(false); }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Déconnexion
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-[#111111] hover:bg-[#F3F4F6] transition-colors border-b border-[#E5E7EB]"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User size={16} className="text-[#4B5563]" />
                          Se connecter
                        </Link>
                        <Link
                          to="/signup"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-[#111111] hover:bg-[#F3F4F6] transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <UserCircle size={16} className="text-[#4B5563]" />
                          S'inscrire
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Search CTA — desktop */}
              <CommandPalette
                triggerClassName="hidden lg:flex h-10 w-10 items-center justify-center rounded-xl text-[#111111] transition-colors hover:text-[#191970]"
                showKeyboardHint={false}
              />

              {/* Search CTA — mobile */}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setMobileSearchOpen(true);
                  setMobileAccordion(null);
                }}
                className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl text-[#111111] transition-colors hover:text-[#191970]"
                aria-label="Rechercher"
              >
                <Search size={20} />
              </button>

              {/* Contact CTA — desktop */}
              <Link
                to="/contact"
                className="hidden lg:inline-flex items-center gap-2 bg-[#191970] text-[#FAFAFA] px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-[#141560] hover:-translate-y-px"
                style={{ boxShadow: '0 2px 8px rgba(25,25,112,0.15)' }}
              >
                Obtenir mon site
              </Link>

              {/* Mobile burger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? (
                  <X size={22} className="text-[#191970]" />
                ) : (
                  <Menu size={22} className="text-[#191970]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-250 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
        style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
      />

      {/* ── Mobile Menu Panel ── */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 lg:hidden w-80 max-w-full bg-[#FAFAFA] flex flex-col transition-transform duration-250 ease-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ boxShadow: '-4px 0 24px rgba(0,0,0,0.1)' }}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-end px-6 h-16 border-b border-[#E5E7EB] flex-shrink-0">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
            aria-label="Fermer"
          >
            <X size={20} className="text-[#191970]" />
          </button>
        </div>

        {mobileSearchOpen && (
          <div className="px-4 pt-4">
            <div className="flex items-center gap-3 rounded-2xl bg-[#F5F5F7] px-3 py-2.5">
              <Search size={18} className="text-[#5E6472]" />
              <input
                autoFocus
                type="text"
                value={mobileSearchValue}
                onChange={(e) => setMobileSearchValue(e.target.value)}
                placeholder={mobileSearchPlaceholder || 'Rechercher...'}
                className="w-full border-0 bg-transparent text-base text-[#111111] placeholder:text-[#5E6472] outline-none"
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>
        )}

        {/* Mobile links */}
        <div className="flex-1 overflow-y-auto py-4">
          <button
            type="button"
            onClick={() => {
              setMobileSearchOpen(true);
              setMobileAccordion(null);
            }}
            className="flex w-full items-center gap-3 px-6 py-3.5 text-sm font-semibold text-[#111111] hover:bg-[#F3F4F6] transition-colors"
          >
            <Search size={16} className="text-[#111111]" />
            Recherche
          </button>

            {/* Services accordion */}
          <div className="flex items-center justify-between px-6">
            <Link
              to="/solutions"
              className="flex items-center gap-3 py-3.5 text-sm font-semibold text-[#111111] hover:text-[#191970] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Services
            </Link>
            <button
              onClick={() => setMobileAccordion(mobileAccordion === 'services' ? null : 'services')}
              className="p-3 rounded-md hover:bg-[#F3F4F6] transition-colors"
              aria-label="Ouvrir les sous-menus Services"
            >
              <ChevronDown
                size={16}
                className={`text-[#4B5563] transition-transform duration-200 ${mobileAccordion === 'services' ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
          {mobileAccordion === 'services' && (
            <div className="bg-white border-y border-[#E5E7EB]">
              {servicesMenu.map((item) => (
                <Link
                  key={item.href + item.label}
                  to={item.href}
                  className="block px-8 py-3 text-sm text-[#4B5563] hover:text-[#191970] hover:bg-[#F3F4F6] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Apprendre */}
          <div className="flex items-center justify-between px-6">
            <Link
              to="/apprendre"
              className="flex items-center gap-3 py-3.5 text-sm font-semibold text-[#111111] hover:text-[#191970] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Apprendre
            </Link>
            <button
              onClick={() => setMobileAccordion(mobileAccordion === 'apprendre' ? null : 'apprendre')}
              className="p-3 rounded-md hover:bg-[#F3F4F6] transition-colors"
              aria-label="Ouvrir les sous-menus Apprendre"
            >
              <ChevronDown
                size={16}
                className={`text-[#4B5563] transition-transform duration-200 ${mobileAccordion === 'apprendre' ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
          {mobileAccordion === 'apprendre' && (
            <div className="bg-white border-y border-[#E5E7EB]">
              <Link
                to="/apprendre#formations"
                className="block px-8 py-3 text-sm text-[#4B5563] hover:text-[#191970] hover:bg-[#F3F4F6] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Formations
              </Link>
              <Link
                to="/apprendre#livres"
                className="block px-8 py-3 text-sm text-[#4B5563] hover:text-[#191970] hover:bg-[#F3F4F6] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Livres
              </Link>
            </div>
          )}

          <Link
            to="/labs"
            className="flex items-center px-6 py-3.5 text-sm font-semibold text-[#111111] hover:bg-[#F3F4F6] hover:text-[#191970] transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Labs
          </Link>

          {/* Blog */}
          <Link
            to="/blog"
            className="flex items-center px-6 py-3.5 text-sm font-semibold text-[#111111] hover:bg-[#F3F4F6] hover:text-[#191970] transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Blog
          </Link>

          {/* MIDEESSI accordion */}
          <div className="flex items-center justify-between px-6">
            <Link
              to="/about"
              className="flex items-center gap-3 py-3.5 text-sm font-semibold text-[#111111] hover:text-[#191970] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              MIDEESSI
            </Link>
            <button
              onClick={() => setMobileAccordion(mobileAccordion === 'mideessi' ? null : 'mideessi')}
              className="p-3 rounded-md hover:bg-[#F3F4F6] transition-colors"
              aria-label="Ouvrir les sous-menus MIDEESSI"
            >
              <ChevronDown
                size={16}
                className={`text-[#4B5563] transition-transform duration-200 ${mobileAccordion === 'mideessi' ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
          {mobileAccordion === 'mideessi' && (
            <div className="bg-white border-y border-[#E5E7EB]">
              {mideessiMenu.map((item) => (
                <Link
                  key={item.href + item.label}
                  to={item.href}
                  className="block px-8 py-3 text-sm text-[#4B5563] hover:text-[#191970] hover:bg-[#F3F4F6] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          <div className="h-px bg-[#E5E7EB] mx-6 my-2" />

          {/* Auth mobile */}
          {user ? (
            <>
              <Link
                to={`/profile/${currentUserProfile?.username || user.email?.split('@')[0]}`}
                className="flex items-center gap-3 px-6 py-3.5 text-sm text-[#4B5563] hover:bg-[#F3F4F6] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <User size={16} />
                Mon Profil
              </Link>
              <Link
                to="/my-library"
                className="flex items-center gap-3 px-6 py-3.5 text-sm text-[#4B5563] hover:bg-[#F3F4F6] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <BookOpen size={16} />
                Ma Bibliothèque
              </Link>
              <button
                onClick={async () => { await signOut(); setMobileOpen(false); }}
                className="flex items-center gap-3 w-full px-6 py-3.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-3 px-6 py-3.5 text-sm text-[#4B5563] hover:bg-[#F3F4F6] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <User size={16} />
                Se connecter
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-3 px-6 py-3.5 text-sm text-[#4B5563] hover:bg-[#F3F4F6] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <UserCircle size={16} />
                S'inscrire
              </Link>
            </>
          )}
        </div>

        {/* Mobile CTA */}
        <div className="px-6 py-5 border-t border-[#E5E7EB] flex-shrink-0">
          <Link
            to="/contact"
            className="flex items-center justify-center w-full bg-[#191970] text-[#FAFAFA] py-3 rounded-xl text-sm font-medium transition-colors hover:bg-[#141560]"
            onClick={() => setMobileOpen(false)}
          >
            Obtenir mon site
          </Link>
        </div>
      </div>

      {/* ── Mobile Search Overlay (separate from drawer) ── */}
      {mobileSearchOpen && !mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex items-start px-4 pt-6">
          <div className="w-full max-w-xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-3">
              <div className="flex items-center gap-3">
                <Search size={18} className="text-[#5E6472]" />
                <input
                  autoFocus
                  type="text"
                  value={mobileSearchValue}
                  onChange={(e) => setMobileSearchValue(e.target.value)}
                  placeholder={mobileSearchPlaceholder || 'Rechercher...'}
                  className="w-full border-0 bg-transparent text-base text-[#111111] placeholder:text-[#5E6472] outline-none"
                  style={{ fontSize: '16px' }}
                />
                <button onClick={() => setMobileSearchOpen(false)} className="p-2 rounded-md">
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;