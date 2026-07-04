import { Facebook, Linkedin, Github, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-midnight dark:bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <img
              src="/mideessi.webp"
              alt="Logo Mideessi"
              className="h-12 w-auto sm:h-14 md:h-16 object-contain mx-auto md:mx-0 mb-4"
              loading="lazy"
              decoding="async"
            />
            <p className="text-gray-300 text-sm">
              Nous sommes indépendants. Innovation locale pour l'Afrique.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-300 hover:text-gold transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-gold transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="/solutions" className="text-gray-300 hover:text-gold transition-colors">
                  Solutions
                </a>
              </li>
              <li>
                <a href="/offres" className="text-gray-300 hover:text-gold transition-colors">
                  Nos Offres
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-300 hover:text-gold transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/learn" className="text-gray-300 hover:text-gold transition-colors">
                  Apprendre
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/legal" className="text-gray-300 hover:text-gold transition-colors">
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="/legal#confidentialite" className="text-gray-300 hover:text-gold transition-colors">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="/legal#conditions" className="text-gray-300 hover:text-gold transition-colors">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-gold transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Nous suivre</h4>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-lg hover:bg-gold hover:text-midnight transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-lg hover:bg-gold hover:text-midnight transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-lg hover:bg-gold hover:text-midnight transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@mideessi.com"
                className="bg-white/10 p-2 rounded-lg hover:bg-gold hover:text-midnight transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-gray-300">contact@mideessi.com</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-white/10">
          <div className="text-sm text-gray-400">
            <p className="font-semibold text-white mb-4">MIDEESSI TECH SARL</p>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#ffd700] mt-1 flex-shrink-0" />
                <div>
                  <p>Zogbo Maison 1953</p>
                  <p>Cotonou, Bénin</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#ffd700] flex-shrink-0" />
                <p>+229 01 64 40 96 91</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#ffd700] flex-shrink-0" />
                <p>contact@mideessi.com</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500">RCCM: RB/COT/26 B 43411</p>
          </div>
          <div className="text-sm text-gray-400">
            <p className="font-semibold text-white mb-2">Responsable de publication</p>
            <p className="text-base font-medium text-[#ffd700]">Coovi Vivotin Medessi</p>
            <p className="text-xs">PDG - MIDEESSI TECH SARL</p>
            <p className="mt-4 text-xs text-gray-500">Conformité RGPD • Souveraineté technologique • 100% Bénin</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} MIDEESSI TECH SARL. Tous droits réservés. Nous sommes indépendants.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
