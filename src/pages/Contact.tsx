import { useEffect } from 'react';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa';
import SEO from '../components/SEO';

const Contact = () => {
  useEffect(() => {
    document.title = 'Contact — MIDEESSI';
  }, []);

  const whatsappLink = 'https://wa.me/2290164409691'; // WhatsApp MIDEESSI
  const phoneLink = 'tel:+2290164409691'; // Téléphone MIDEESSI
  const emailLink = 'mailto:contact@mideessi.com'; // Email MIDEESSI

  const contactCards = [
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      description: 'Réponse en quelques minutes',
      buttonText: 'Écrire',
      link: whatsappLink,
    },
    {
      icon: FaPhone,
      title: 'Appel',
      description: 'Réponse immédiate',
      buttonText: 'Appeler',
      link: phoneLink,
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      description: 'Demandes détaillées',
      buttonText: 'Envoyer',
      link: emailLink,
    },
  ];

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
      <SEO
        title="Contact MIDEESSI — Parlons de votre projet"
        description="Contactez MIDEESSI en moins de 5 secondes. WhatsApp, appel, email ou visite en personne à Cotonou."
      />

      {/* ══════════════════════════════════════
          SECTION HERO
          ══════════════════════════════════════ */}
      <section style={{ paddingTop: 'clamp(88px, 14vh, 132px)', paddingBottom: 'clamp(60px, 8vh, 100px)' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1
              className="font-bold mb-4 md:mb-6"
              style={{
                fontSize: 'clamp(28px, 6vw, 48px)',
                lineHeight: 1.15,
                color: '#111827',
                letterSpacing: '-0.04em',
              }}
            >
              Parlons de votre projet
            </h1>
            <p
              className="text-sm md:text-base leading-relaxed"
              style={{
                color: '#5E6472',
                fontSize: 'clamp(14px, 2vw, 18px)',
              }}
            >
              Choisissez simplement le moyen le plus rapide pour nous contacter.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION CONTACT CARDS
          ══════════════════════════════════════ */}
      <section style={{ paddingBottom: 'clamp(40px, 6vh, 80px)' }}>
        <div className="max-w-[1200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-12">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {contactCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <a
                  key={index}
                  href={card.link}
                  target={card.title === 'Email' ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center text-center p-2 sm:p-3 md:p-6 lg:p-8 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    minHeight: 'auto',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Icon */}
                  <div
                    className="mb-2 sm:mb-3 md:mb-4 lg:mb-6 flex h-10 sm:h-12 md:h-16 lg:h-20 w-10 sm:w-12 md:w-16 lg:w-20 items-center justify-center rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-2xl transition-all duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: '#F3F4F6',
                    }}
                  >
                    <Icon
                      size={16}
                      className="sm:hidden"
                      style={{
                        color: '#191970',
                      }}
                    />
                    <Icon
                      size={20}
                      className="hidden sm:block md:hidden"
                      style={{
                        color: '#191970',
                      }}
                    />
                    <Icon
                      size={28}
                      className="hidden md:block lg:hidden"
                      style={{
                        color: '#191970',
                      }}
                    />
                    <Icon
                      size={36}
                      className="hidden lg:block"
                      style={{
                        color: '#191970',
                      }}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className="text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-1 sm:mb-2 md:mb-3"
                    style={{ color: '#111827' }}
                  >
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-2xs sm:text-xs md:text-sm lg:text-base leading-tight sm:leading-relaxed mb-2 sm:mb-3 md:mb-4 lg:mb-6 flex-1"
                    style={{ color: '#5E6472', fontSize: 'clamp(10px, 2vw, 16px)' }}
                  >
                    {card.description}
                  </p>

                  {/* Button */}
                  <div
                    className="inline-flex items-center justify-center gap-0.5 px-2 sm:px-2.5 md:px-3 lg:px-4 py-0.5 sm:py-1 md:py-1.5 lg:py-2 rounded-full font-semibold transition-all duration-300 group-hover:gap-1 group-hover/btn:gap-1 sm:group-hover/btn:gap-1.5 md:group-hover/btn:gap-2 group/btn whitespace-nowrap pointer-events-none"
                    style={{
                      backgroundColor: '#191970',
                      color: '#FFFFFF',
                      fontSize: 'clamp(9px, 1.5vw, 14px)',
                    }}
                  >
                    {card.buttonText}
                    <ArrowRight
                      size={10}
                      className="sm:hidden transition-transform duration-300 group-hover/btn:translate-x-0.5"
                    />
                    <ArrowRight
                      size={12}
                      className="hidden sm:block md:hidden transition-transform duration-300 group-hover/btn:translate-x-0.5"
                    />
                    <ArrowRight
                      size={14}
                      className="hidden md:block lg:hidden transition-transform duration-300 group-hover/btn:translate-x-1"
                    />
                    <ArrowRight
                      size={16}
                      className="hidden lg:block transition-transform duration-300 group-hover/btn:translate-x-1"
                    />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION LOCATION
          ══════════════════════════════════════ */}
      <section style={{ paddingBottom: 'clamp(60px, 8vh, 100px)', backgroundColor: '#FFFFFF' }}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Section Title */}
          <div className="mb-8 sm:mb-12 md:mb-16">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold"
              style={{
                color: '#111827',
                letterSpacing: '-0.02em',
              }}
            >
              Nous trouver facilement
            </h2>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {/* Left: Google Maps */}
            <div className="flex flex-col">
              <div
                className="w-full h-64 sm:h-72 md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg"
                style={{ border: '1px solid #E5E7EB' }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1982.5077893090534!2d2.3925709663754477!3d6.391991008998649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10235532786e264d%3A0xec070ef519492fe7!2sMIDEESSI!5e0!3m2!1sfr!2sus!4v1786664514780!5m2!1sfr!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Localisation MIDEESSI"
                />
              </div>
            </div>

            {/* Right: Address Info */}
            <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
              {/* Address Card */}
              <div
                className="p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl"
                style={{
                  backgroundColor: '#FAFAFA',
                  border: '1px solid #E5E7EB',
                }}
              >
                <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <MapPin
                    size={20}
                    className="sm:block md:hidden"
                    style={{
                      color: '#191970',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  />
                  <MapPin
                    size={24}
                    className="hidden sm:block md:hidden"
                    style={{
                      color: '#191970',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  />
                  <MapPin
                    size={28}
                    className="hidden md:block"
                    style={{
                      color: '#191970',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  />
                  <div>
                    <h3
                      className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2"
                      style={{ color: '#111827' }}
                    >
                      Notre adresse
                    </h3>
                    <p
                      className="text-xs sm:text-sm md:text-base font-semibold mb-0.5 sm:mb-1"
                      style={{ color: '#111827' }}
                    >
                      MIDEESSI
                    </p>
                    <p
                      className="text-xs sm:text-sm"
                      style={{ color: '#5E6472' }}
                    >
                      Zogbo<br />
                      Cotonou – Bénin
                    </p>
                  </div>
                </div>

                {/* Directions */}
                <div className="border-t border-[#E5E7EB] pt-4 sm:pt-6">
                  <p
                    className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3"
                    style={{ color: '#191970' }}
                  >
                    Comment nous trouver :
                  </p>
                  <div
                    className="text-xs sm:text-sm leading-relaxed space-y-1 sm:space-y-2"
                    style={{ color: '#5E6472' }}
                  >
                    <p>Depuis la pharmacie Tamaya, prenez la rue qui lui fait face.</p>
                    <p>Une fois engagé dans cette rue, prenez immédiatement la première rue à gauche.</p>
                    <p>Vous trouverez un immeuble blanc entièrement carrelé avec une guérite de gardien juste devant.</p>
                    <p className="font-semibold" style={{ color: '#191970' }}>C'est ici.</p>
                  </div>
                </div>
              </div>

              {/* Hours Card */}
              <div
                className="p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl"
                style={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                }}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <Clock
                    size={20}
                    className="sm:block md:hidden"
                    style={{
                      color: '#FFD700',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  />
                  <Clock
                    size={24}
                    className="hidden sm:block md:hidden"
                    style={{
                      color: '#FFD700',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  />
                  <Clock
                    size={28}
                    className="hidden md:block"
                    style={{
                      color: '#FFD700',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  />
                  <div className="w-full">
                    <h3
                      className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-4"
                      style={{ color: '#111827' }}
                    >
                      Horaires
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center gap-2 text-xs sm:text-sm">
                        <span
                          className="font-semibold"
                          style={{ color: '#111827' }}
                        >
                          Lundi – Vendredi
                        </span>
                        <span
                          style={{ color: '#5E6472' }}
                        >
                          08h00 – 18h00
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-2 text-xs sm:text-sm">
                        <span
                          className="font-semibold"
                          style={{ color: '#111827' }}
                        >
                          Samedi
                        </span>
                        <span
                          style={{ color: '#5E6472' }}
                        >
                          09h00 – 14h00
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BOTTOM SPACER
          ══════════════════════════════════════ */}
      <div style={{ height: '60px' }} />
    </div>
  );
};

export default Contact;
