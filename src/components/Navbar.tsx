// Navbar.tsx
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Cpu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const links = [
    { to: '/', label: 'Accueil' },
    { to: '/about', label: 'À propos' },
    { to: '/projects', label: 'Solutions' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ];

  // Détection du scroll pour effet glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile et scroll vers le haut lors du changement de page
  useEffect(() => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-midnight/95 backdrop-blur-md shadow-lg'
            : 'bg-white dark:bg-midnight shadow-md'
        } border-b border-corporate-200 dark:border-corporate-700`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo avec animation hover */}
            <Link
              to="/"
              className="flex items-center space-x-2 group"
            >
              <div className="relative">
            <img src="/mideessi.png" alt="Logo Mideessi" className="w-12 h-12 object-contain mr-2" />
                <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
              </div>
           
            </Link>

            {/* Navigation Desktop avec indicateur animé */}
            <div className="hidden md:flex items-center space-x-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative px-4 py-2 group"
                >
                  <span
                    className={`text-sm font-semibold transition-colors duration-200 ${
                      isActive(link.to)
                        ? 'text-blue-600'
                        : 'text-corporate-700 dark:text-corporate-200 group-hover:text-blue-600'
                    }`}
                  >
                    {link.label}
                  </span>
                  {/* Indicateur de page active */}
                  {isActive(link.to) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 animate-[slideIn_0.3s_ease-out]" />
                  )}
                  {/* Effet hover */}
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              ))}

              {/* Toggle theme avec animation */}
              <button
                onClick={toggleTheme}
                className="ml-4 p-2 rounded-lg bg-corporate-100 dark:bg-corporate-800 hover:bg-corporate-200 dark:hover:bg-corporate-700 transition-all duration-300 hover:scale-110 active:scale-95"
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
                className="p-2 rounded-lg bg-corporate-100 dark:bg-corporate-800 hover:bg-corporate-200 dark:hover:bg-corporate-700 transition-all duration-300 active:scale-95"
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
                className="text-midnight dark:text-white hover:text-blue-600 transition-all duration-300 active:scale-95"
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
        {/* Overlay avec blur */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Panel du menu */}
        <div
          className={`absolute top-16 left-0 right-0 bg-white dark:bg-midnight border-b border-corporate-200 dark:border-corporate-700 shadow-2xl transition-transform duration-300 ${
            isOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="px-4 pt-4 pb-6 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {links.map((link, index) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 transform ${
                  isActive(link.to)
                    ? 'bg-blue-50 dark:bg-corporate-800 text-blue-600 scale-105 shadow-md'
                    : 'text-corporate-700 dark:text-corporate-200 hover:bg-corporate-50 dark:hover:bg-corporate-800 hover:text-blue-600 hover:translate-x-2'
                }`}
                style={{
                  transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
                }}
              >
                <span className="flex items-center justify-between">
                  {link.label}
                  {isActive(link.to) && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Styles pour l'animation slideIn */}
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