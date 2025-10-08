import { Menu, X, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/about', label: 'À propos' },
        { href: '/learn', label: 'Apprendre' },
    { href: '/projects', label: 'Solutions' },
    { href: '/blog', label: 'Blog' },
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

  // Bloquer le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const isActive = (path) => {
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
            {/* Logo avec animation hover et changement selon le thème */}
            <a
              href="/"
              className="flex items-center space-x-2 group"
            >
              <div className="relative w-12 h-12">
                {/* Logo clair (visible en mode light) */}
                <img 
                  src="/mideessi-light.webp" 
                  alt="Logo Mideessi" 
                  className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ${
                    isDark 
                      ? 'opacity-0 scale-90 rotate-180' 
                      : 'opacity-100 scale-100 rotate-0'
                  }`}
                />
                
                {/* Logo sombre (visible en mode dark) */}
                <img 
                  src="/mideessi.webp" 
                  alt="Logo Mideessi" 
                  className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ${
                    isDark 
                      ? 'opacity-100 scale-100 rotate-0' 
                      : 'opacity-0 scale-90 -rotate-180'
                  }`}
                />
                
                {/* Effet de glow au survol */}
                <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
              </div>
            </a>

            {/* Navigation Desktop avec indicateur animé */}
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
                        ? 'text-blue-600'
                        : 'text-gray-700 dark:text-gray-200 group-hover:text-blue-600'
                    }`}
                  >
                    {link.label}
                  </span>
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 animate-[slideIn_0.3s_ease-out]" />
                  )}
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </a>
              ))}

              {/* Toggle theme avec animation */}
              <button
                onClick={toggleTheme}
                className="ml-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Toggle theme"
              >
                <div className="relative w-5 h-5">
                  <Sun
                    className={`w-5 h-5 text-blue-600 absolute inset-0 transition-all duration-500 ${
                      isDark
                        ? 'rotate-0 opacity-100 scale-100'
                        : 'rotate-90 opacity-0 scale-0'
                    }`}
                  />
                  <Moon
                    className={`w-5 h-5 text-blue-600 absolute inset-0 transition-all duration-500 ${
                      isDark
                        ? '-rotate-90 opacity-0 scale-0'
                        : 'rotate-0 opacity-100 scale-100'
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* Boutons Mobile */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 active:scale-95"
                aria-label="Toggle theme"
              >
                <div className="relative w-5 h-5">
                  <Sun
                    className={`w-5 h-5 text-blue-600 absolute inset-0 transition-all duration-500 ${
                      isDark
                        ? 'rotate-0 opacity-100 scale-100'
                        : 'rotate-90 opacity-0 scale-0'
                    }`}
                  />
                  <Moon
                    className={`w-5 h-5 text-blue-600 absolute inset-0 transition-all duration-500 ${
                      isDark
                        ? '-rotate-90 opacity-0 scale-0'
                        : 'rotate-0 opacity-100 scale-100'
                    }`}
                  />
                </div>
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-900 dark:text-white hover:text-blue-600 transition-all duration-300 active:scale-95"
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-6">
                  <Menu
                    className={`w-6 h-6 absolute inset-0 transition-all duration-300 ${
                      isOpen ? 'rotate-90 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'
                    }`}
                  />
                  <X
                    className={`w-6 h-6 absolute inset-0 transition-all duration-300 ${
                      isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-0'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Mobile avec animation slide */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isOpen ? 'visible' : 'invisible'
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-2xl transition-transform duration-300 ${
            isOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="px-4 pt-4 pb-6 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 transform ${
                  isActive(link.href)
                    ? 'bg-blue-50 dark:bg-gray-800 text-blue-600 scale-105 shadow-md'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 hover:translate-x-2'
                }`}
                style={{
                  transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
                }}
              >
                <span className="flex items-center justify-between">
                  {link.label}
                  {isActive(link.href) && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                  )}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;