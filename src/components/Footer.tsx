import { Facebook, Linkedin, Github, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRoute } from '../utils/routes';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#111111', color: '#FAFAFA' }}>

      {/* ── Pre-footer CTA ── */}
      <div
        className="border-b"
        style={{ borderColor: 'rgba(255,255,255,0.08)', padding: '80px 0' }}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.12em] mb-4" style={{ color: 'rgba(250,250,250,0.5)' }}>
            Prêt à démarrer ?
          </p>
          <h2
            className="font-bold mb-6"
            style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
          >
            Un projet en tête ?<br />
            <span style={{ color: 'rgba(250,250,250,0.75)' }}>Parlons-en.</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={getRoute.contact()}
              className="inline-flex items-center gap-2 bg-[#FAFAFA] text-[#191970] px-7 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-white hover:-translate-y-px"
              style={{ boxShadow: '0 2px 12px rgba(250,250,250,0.15)' }}
            >
              Nous contacter
              <ArrowRight size={16} />
            </Link>
            <a
              href="mailto:contact@mideessi.com"
              className="text-sm"
              style={{ color: 'rgba(250,250,250,0.55)', transition: 'color 200ms' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(250,250,250,0.9)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,250,250,0.55)')}
            >
              ou écrivez directement : contact@mideessi.com
            </a>
          </div>
        </div>
      </div>

      {/* ── Main footer ── */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Col 1 — Brand */}
          <div className="lg:col-span-1">
            <img
              src="/mideessi.webp"
              alt="MIDEESSI"
              className="h-9 w-auto object-contain mb-5"
              loading="lazy"
              decoding="async"
            />
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(250,250,250,0.5)' }}>
              Initiative technologique béninoise pour la souveraineté numérique africaine.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61578393594703&mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
              >
                <Github size={16} />
              </a>
              <a
                href="mailto:contact@mideessi.com"
                aria-label="Email"
                className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <h4 className="text-sm font-semibold mb-5" style={{ color: '#FAFAFA', letterSpacing: '0.05em' }}>
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Notre mission', href: getRoute.about() },
                { label: 'Solutions', href: getRoute.solutions() },
                { label: 'MIDEESSI Learn', href: getRoute.apprendre() },
                { label: 'Nos projets', href: getRoute.projects() },
                { label: 'Articles', href: getRoute.blog() },
                { label: 'Ateliers', href: getRoute.ateliers() },
              ].map(item => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm transition-colors"
                    style={{ color: 'rgba(250,250,250,0.55)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(250,250,250,0.9)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,250,250,0.55)')}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Légal */}
          <div>
            <h4 className="text-sm font-semibold mb-5" style={{ color: '#FAFAFA', letterSpacing: '0.05em' }}>
              Légal
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Mentions légales', href: getRoute.legal() },
                { label: 'Confidentialité', href: getRoute.legal() + '#confidentialite' },
                { label: "Conditions d'utilisation", href: getRoute.legal() + '#conditions' },
                { label: 'Contact', href: getRoute.contact() },
              ].map(item => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm transition-colors"
                    style={{ color: 'rgba(250,250,250,0.55)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(250,250,250,0.9)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,250,250,0.55)')}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-5" style={{ color: '#FAFAFA', letterSpacing: '0.05em' }}>
              MIDEESSI TECH SARL
            </h4>
            <div className="space-y-3 text-sm" style={{ color: 'rgba(250,250,250,0.55)' }}>
              <div className="flex items-start gap-3">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#FFD700' }} />
                <span>Zogbo Maison 1953<br />Cotonou, Bénin</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={14} className="flex-shrink-0" style={{ color: '#FFD700' }} />
                <span>+229 01 64 40 96 91</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={14} className="flex-shrink-0" style={{ color: '#FFD700' }} />
                <a
                  href="mailto:contact@mideessi.com"
                  className="transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(250,250,250,0.9)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,250,250,0.55)')}
                >
                  contact@mideessi.com
                </a>
              </div>
              <p className="text-xs pt-1" style={{ color: 'rgba(250,250,250,0.35)' }}>
                RCCM: RB/COT/26 B 43411
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(250,250,250,0.35)' }}>
            © {currentYear} MIDEESSI TECH SARL. Tous droits réservés.
          </p>
          <p className="text-sm font-medium italic" style={{ color: '#FFD700' }}>
            Consommons béninois.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
