import { Moon, Sun, UserCircle, LogOut, BookOpen, Menu, Package, MoreVertical, Rocket, Book, Users, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import CommandPalette from './CommandPalette';
import SideDrawer from './SideDrawer';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { user, signOut } = useAuth();
  const { showDrawer, setShowDrawer } = useNavigation();

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/offres', label: 'Nos Offres' },
    { href: '/ateliers', label: 'Ateliers' },
    { href: '/blog', label: 'Blog' },
    { href: '/learn', label: 'Apprendre' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ];

  // Fonction pour déterminer si c'est la nuit (18h-6h)
  const isNightTime = () => {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6;
  };

  // Initialiser le thème au chargement
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const autoMode = localStorage.getItem('autoMode') !== 'false';
    
    let shouldBeDark = false;
    
    if (savedTheme && !autoMode) {
      shouldBeDark = savedTheme === 'dark';
    } else {
      shouldBeDark = isNightTime();
    }
    
    setIsDark(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (autoMode) {
      const interval = setInterval(() => {
        const nightTime = isNightTime();
        if (nightTime !== isDark) {
          setIsDark(nightTime);
          if (nightTime) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [isDark]);

  // Fonction pour changer le thème
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    localStorage.setItem('autoMode', 'false');
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Détection du scroll pour effet glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloquer le scroll when stuff opens (not needed anymore since no mobile menu)
  // Removed old scroll blocking code

  const isActive = (path: string) => {
    if (typeof window !== 'undefined') {
      return window.location.pathname === path;
    }
    return false;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-midnight/95 backdrop-blur-md shadow-lg'
            : 'bg-white dark:bg-midnight shadow-md'
        } border-b border-gray-200 dark:border-gray-700`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* LEFT: Hamburger + Logo */}
            <div className="flex items-center gap-3">
              {/* Hamburger Menu (Mobile Only) */}
              <button
                onClick={() => setShowDrawer(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-midnight dark:text-white" />
              </button>

              {/* Logo */}
              <a href="/" className="flex items-center space-x-2 group">
                <div className="relative w-12 h-12">
                  <img 
                    src="/mideessi-light.webp" 
                    alt="Logo Mideessi" 
                    className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ${
                      isDark 
                        ? 'opacity-0 scale-90 rotate-180' 
                        : 'opacity-100 scale-100 rotate-0'
                    }`}
                  />
                  <img 
                    src="/mideessi.webp" 
                    alt="Logo Mideessi" 
                    className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ${
                      isDark 
                        ? 'opacity-100 scale-100 rotate-0' 
                        : 'opacity-0 scale-90 -rotate-180'
                    }`}
                  />
                  <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                </div>
              </a>
            </div>

            {/* CENTER: Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 group"
                >
                  <span
                    className={`text-sm font-semibold transition-colors duration-200 ${
                      isActive(link.href)
                        ? 'text-gold'
                        : 'text-gray-700 dark:text-gray-200 group-hover:text-gold'
                    }`}
                  >
                    {link.label}
                  </span>
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                  )}
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </a>
              ))}

              {/* More Menu Button */}
              <div className="relative ml-2">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="relative px-4 py-2 group flex items-center gap-2 rounded-lg hover:bg-gold/10 transition-colors"
                  aria-label="Plus de pages"
                  title="Accès aux autres pages: Projets, Équipe, Bibliothèque, Carrières"
                >
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-gold transition-colors">
                    Plus
                  </span>
                  <MoreVertical className="w-4 h-4 text-gray-700 dark:text-gray-200 group-hover:text-gold transition-colors" />
                </button>

                {/* More Menu Dropdown */}
                {showMoreMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-midnight rounded-xl shadow-2xl border-2 border-gold/30 z-50 overflow-hidden">
                    <div className="px-4 py-3 bg-gradient-to-r from-gold/10 to-yellow-100/10 dark:from-gold/20 dark:to-blue-900/20 border-b-2 border-gold/20">
                      <p className="text-xs font-bold text-gold uppercase tracking-widest">Plus de pages</p>
                    </div>
                    <a
                      href="/projects"
                      className="block px-4 py-3 text-midnight dark:text-white hover:bg-gold/10 transition-colors flex items-center gap-3 text-sm font-medium border-b border-gold/10"
                      onClick={() => setShowMoreMenu(false)}
                    >
                      <Rocket size={18} className="text-gold" />
                      <span>Nos Projets</span>
                    </a>
                    <a
                      href="/about#team"
                      className="block px-4 py-3 text-midnight dark:text-white hover:bg-gold/10 transition-colors flex items-center gap-3 text-sm font-medium border-b border-gold/10"
                      onClick={() => setShowMoreMenu(false)}
                    >
                      <Users size={18} className="text-gold" />
                      <span>Équipe</span>
                    </a>
                    <a
                      href="/library"
                      className="block px-4 py-3 text-midnight dark:text-white hover:bg-gold/10 transition-colors flex items-center gap-3 text-sm font-medium border-b border-gold/10"
                      onClick={() => setShowMoreMenu(false)}
                    >
                      <Book size={18} className="text-gold" />
                      <span>Bibliothèque</span>
                    </a>
                    <a
                      href="/careers"
                      className="block px-4 py-3 text-midnight dark:text-white hover:bg-gold/10 transition-colors flex items-center gap-3 text-sm font-medium"
                      onClick={() => setShowMoreMenu(false)}
                    >
                      <Briefcase size={18} className="text-gold" />
                      <span>Carrières</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Search, Theme, Auth */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Desktop Search (Command Palette) */}
              <div className="hidden md:block">
                <CommandPalette />
              </div>

              {/* Marketplace Solutions Icon */}
              <Link
                to="/solutions"
                className="p-2 rounded-lg bg-gradient-to-r from-gold/10 to-yellow-100/10 dark:from-gold/20 dark:to-blue-900/20 hover:from-gold/20 hover:to-yellow-100/20 dark:hover:from-gold/30 dark:hover:to-blue-900/30 transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Solutions Marketplace"
                title="Marketplace Solutions"
              >
                <Package className="w-5 h-5 text-gold" />
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Toggle theme"
              >
                <div className="relative w-5 h-5">
                  <Sun
                    className={`w-5 h-5 text-gold absolute inset-0 transition-all duration-500 ${
                      isDark
                        ? 'rotate-0 opacity-100 scale-100'
                        : 'rotate-90 opacity-0 scale-0'
                    }`}
                  />
                  <Moon
                    className={`w-5 h-5 text-gold absolute inset-0 transition-all duration-500 ${
                      isDark
                        ? '-rotate-90 opacity-0 scale-0'
                        : 'rotate-0 opacity-100 scale-100'
                    }`}
                  />
                </div>
              </button>

              {/* Auth Section */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 rounded-lg bg-gold/10 hover:bg-gold/20 dark:bg-gold/20 dark:hover:bg-gold/30 transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="User menu"
                    title={user.email}
                  >
                    <UserCircle className="w-5 h-5 text-gold" />
                  </button>

                  {/* User Menu Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-midnight rounded-xl shadow-2xl border-2 border-gold/30 z-50 overflow-hidden">
                      <div className="px-4 py-4 bg-gradient-to-r from-gold/10 to-yellow-100/10 dark:from-gold/20 dark:to-blue-900/20 border-b-2 border-gold/20">
                        <p className="text-sm font-semibold text-midnight dark:text-gold truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        to={`/profile/${user.user_metadata?.username || user.email?.split('@')[0]}`}
                        className="block px-4 py-3 text-midnight dark:text-white hover:bg-gold/10 transition-colors flex items-center gap-2 text-sm font-medium"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserCircle size={18} className="text-gold" />
                        Mon Profil
                      </Link>
                      <Link
                        to="/my-library"
                        className="block px-4 py-3 text-midnight dark:text-white hover:bg-gold/10 transition-colors flex items-center gap-2 text-sm font-medium border-b border-gold/10"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <BookOpen size={18} className="text-gold" />
                        Ma Bibliothèque
                      </Link>
                      <button
                        onClick={async () => {
                          await signOut();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <LogOut size={18} />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="hidden px-3 py-2 rounded-lg text-midnight dark:text-white border-2 border-gold/40 hover:border-gold hover:bg-gold/5 transition-all text-xs md:text-sm font-bold"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/signup"
                    className="hidden px-3 py-2 rounded-lg bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-midnight transition-all text-xs md:text-sm font-bold shadow-lg hover:shadow-gold/50"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Side Drawer */}
      <SideDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} />
    </>
  );
};

export default Navbar;