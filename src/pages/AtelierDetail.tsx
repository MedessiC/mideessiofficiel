import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  CheckCircle,
  Mail,
  MessageCircle,
  Zap,
  Star,
  Share2,
  Heart,
  AlertCircle,
  Globe,
  Laptop,
} from 'lucide-react';
import SEO from '../components/SEO';
import { getAtelierBySlug, Atelier, getDaysRemaining, isAtelierPassed, getCountdownStatus } from '../data/ateliers';

const AtelierDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [atelier, setAtelier] = useState<Atelier | null>(null);
  const [activeTab, setActiveTab] = useState<'program' | 'requirements' | 'instructor'>('program');
  const [bookingStep, setBookingStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
  });
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    const foundAtelier = getAtelierBySlug(slug || '');
    if (foundAtelier) {
      setAtelier(foundAtelier);
    } else {
      navigate('/ateliers');
    }
  }, [slug, navigate]);

  if (!atelier) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-lg text-gray-600 dark:text-gray-400">Chargement...</p>
      </div>
    );
  }

  const availableSpots = atelier.capacity - atelier.registered;
  const isFull = availableSpots <= 0;
  const isAlmostFull = availableSpots <= 5;
  const daysRemaining = getDaysRemaining(atelier.date);
  const isPassed = isAtelierPassed(atelier.date);
  const countdownStatus = getCountdownStatus(atelier.date);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingStep === 0) {
      if (bookingData.firstName && bookingData.lastName && bookingData.email) {
        setBookingStep(1);
      }
    } else if (bookingStep === 1) {
      if (bookingData.phone && bookingData.company) {
        setIsBooked(true);
        setBookingStep(0);
        // Reset form
        setBookingData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => price.toLocaleString();

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <SEO
        title={`${atelier.title} | MIDEESSI - Ateliers`}
        description={atelier.description}
        keywords={[atelier.title, 'atelier', 'formation', 'MIDEESSI', ...atelier.tags]}
      />

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={atelier.image} alt={atelier.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/70 dark:bg-black/80"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href="/ateliers"
            className="inline-flex items-center gap-2 text-white hover:text-gold transition-colors mb-6 md:mb-8 text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux ateliers
          </a>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 min-w-0">
              <div className="flex flex-col md:flex-row md:items-start md:gap-4 mb-4 md:mb-6 gap-3">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight break-words">
                    {atelier.title}
                  </h1>
                </div>
                <div className="flex flex-col gap-2">
                  <span
                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap flex-shrink-0 text-center ${
                      atelier.level === 'Débutant'
                        ? 'bg-green-500/90'
                        : atelier.level === 'Intermédiaire'
                        ? 'bg-blue-500/90'
                        : 'bg-purple-500/90'
                    } text-white`}
                  >
                    {atelier.level}
                  </span>
                  {isPassed ? (
                    <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap flex-shrink-0 bg-gray-500/90 text-white text-center flex items-center justify-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Passé
                    </span>
                  ) : countdownStatus === 'today' ? (
                    <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap flex-shrink-0 bg-red-500/90 text-white text-center animate-pulse flex items-center justify-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Aujourd'hui!
                    </span>
                  ) : countdownStatus === 'tomorrow' ? (
                    <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap flex-shrink-0 bg-orange-500/90 text-white text-center">
                      Demain
                    </span>
                  ) : countdownStatus === 'soon' ? (
                    <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap flex-shrink-0 bg-yellow-500/90 text-white text-center">
                      {daysRemaining} jour{daysRemaining > 1 ? 's' : ''}
                    </span>
                  ) : null}
                </div>
              </div>
              <p className="text-lg md:text-xl text-gray-200 mb-4 md:mb-6 font-semibold">{atelier.description}</p>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 md:p-4 border border-white/20">
                  <Calendar className="w-5 h-5 text-gold mb-2" />
                  <p className="text-xs text-gray-300 mb-1">Date</p>
                  <p className="text-sm font-bold text-white">{formatDate(atelier.date)}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 md:p-4 border border-white/20">
                  <Clock className="w-5 h-5 text-gold mb-2" />
                  <p className="text-xs text-gray-300 mb-1">Durée</p>
                  <p className="text-sm font-bold text-white">{atelier.duration} min</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 md:p-4 border border-white/20">
                  <Users className="w-5 h-5 text-gold mb-2" />
                  <p className="text-xs text-gray-300 mb-1">Places</p>
                  <p className={`text-sm font-bold ${isFull ? 'text-red-400' : 'text-white'}`}>
                    {availableSpots > 0 ? `${availableSpots}/${atelier.capacity}` : 'Complet'}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 md:p-4 border border-white/20">
                  <Zap className="w-5 h-5 text-gold mb-2" />
                  <p className="text-xs text-gray-300 mb-1">Catégorie</p>
                  <p className="text-sm font-bold text-white capitalize">{atelier.category}</p>
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl h-fit">
              {isBooked ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-midnight dark:text-white mb-2">
                    Réservation confirmée!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Un email de confirmation a été envoyé à {bookingData.email}
                  </p>
                  <button
                    onClick={() => setIsBooked(false)}
                    className="w-full bg-gold text-midnight font-bold py-2 px-4 rounded-lg hover:bg-gold/90 transition-colors"
                  >
                    Nouvelle réservation
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <p className="text-3xl md:text-4xl font-bold text-gold mb-2">
                      {formatPrice(atelier.price)} FCFA
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">par personne</p>
                  </div>

                  {/* Booking Form */}
                  <form onSubmit={handleBooking} className="space-y-4">
                    {bookingStep === 0 ? (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
                            Prénom
                          </label>
                          <input
                            type="text"
                            value={bookingData.firstName}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, firstName: e.target.value })
                            }
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight dark:text-white focus:outline-none focus:border-gold"
                            placeholder="Votre prénom"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
                            Nom
                          </label>
                          <input
                            type="text"
                            value={bookingData.lastName}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, lastName: e.target.value })
                            }
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight dark:text-white focus:outline-none focus:border-gold"
                            placeholder="Votre nom"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={bookingData.email}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, email: e.target.value })
                            }
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight dark:text-white focus:outline-none focus:border-gold"
                            placeholder="votre@email.com"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
                            Téléphone
                          </label>
                          <input
                            type="tel"
                            value={bookingData.phone}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, phone: e.target.value })
                            }
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight dark:text-white focus:outline-none focus:border-gold"
                            placeholder="+229 XXXXXXXX"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-midnight dark:text-white mb-2">
                            Entreprise/Organisation
                          </label>
                          <input
                            type="text"
                            value={bookingData.company}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, company: e.target.value })
                            }
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-midnight dark:text-white focus:outline-none focus:border-gold"
                            placeholder="Votre entreprise"
                          />
                        </div>
                      </>
                    )}

                    <button
                      type="submit"
                      disabled={isFull || isPassed}
                      className={`w-full font-bold py-3 px-4 rounded-lg transition-all text-center ${
                        isPassed
                          ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                          : isFull
                          ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                          : 'bg-gold hover:bg-gold/90 text-midnight'
                      }`}
                    >
                      {isPassed ? 'Atelier terminé' : isFull ? 'Atelier complet' : bookingStep === 0 ? 'Continuer' : 'Confirmer réservation'}
                    </button>

                    {bookingStep === 1 && (
                      <button
                        type="button"
                        onClick={() => setBookingStep(0)}
                        className="w-full bg-gray-200 dark:bg-gray-700 text-midnight dark:text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Retour
                      </button>
                    )}
                  </form>

                  {isAlmostFull && !isFull && !isPassed && (
                    <p className="text-center text-sm text-red-500 font-semibold mt-4 flex items-center justify-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Plus que {availableSpots} place{availableSpots > 1 ? 's' : ''} disponible!
                    </p>
                  )}

                  {isPassed && (
                    <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 mt-4 text-center">
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        Cet atelier s'est déroulé le {formatDate(atelier.date)}
                      </p>
                    </div>
                  )}

                  {/* Share and Like */}
                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm font-semibold">Partager</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-semibold">Sauvegarder</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex gap-2 md:gap-4 mb-8 md:mb-12 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {(['program', 'requirements', 'instructor'] as const).map((tabName) => (
              <button
                key={tabName}
                onClick={() => setActiveTab(tabName)}
                className={`py-3 md:py-4 px-3 md:px-6 font-semibold transition-all border-b-2 whitespace-nowrap text-sm md:text-base ${
                  activeTab === tabName
                    ? 'border-gold text-gold'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-midnight dark:hover:text-white'
                }`}
              >
                {tabName === 'program' && <span>Programme</span>}
                {tabName === 'requirements' && <span>Prérequis</span>}
                {tabName === 'instructor' && <span>Instructeur</span>}
              </button>
            ))}
          </div>

          {/* Program Tab */}
          {activeTab === 'program' && (
            <div className="space-y-4 md:space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8">
                <h3 className="text-2xl font-bold text-midnight dark:text-white mb-6">Objectifs de l'atelier</h3>
                <ul className="space-y-3 md:space-y-4">
                  {atelier.objectives.map((objective, idx) => (
                    <li key={idx} className="flex items-start gap-3 md:gap-4">
                      <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-gold flex-shrink-0 mt-0.5 md:mt-1" />
                      <span className="text-sm md:text-lg text-gray-700 dark:text-gray-300">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8">
                <h3 className="text-2xl font-bold text-midnight dark:text-white mb-6">Programme détaillé</h3>
                <div className="space-y-4">
                  {atelier.program.map((session, idx) => (
                    <div
                      key={idx}
                      className="border-l-4 border-gold pl-4 md:pl-6 py-3 md:py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-r-lg"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 md:w-5 md:h-5 text-gold" />
                        <p className="text-sm md:text-base font-bold text-midnight dark:text-white">
                          {session.time}
                        </p>
                      </div>
                      <h4 className="text-base md:text-lg font-semibold text-midnight dark:text-white mb-1 md:mb-2">
                        {session.title}
                      </h4>
                      {session.description && (
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                          {session.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {atelier.materials.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-midnight dark:text-white mb-6">Matériel fourni</h3>
                  <ul className="space-y-3 md:space-y-4">
                    {atelier.materials.map((material, idx) => (
                      <li key={idx} className="flex items-start gap-3 md:gap-4">
                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-gold flex-shrink-0 mt-0.5 md:mt-1" />
                        <span className="text-sm md:text-lg text-gray-700 dark:text-gray-300">
                          {material}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Requirements Tab */}
          {activeTab === 'requirements' && (
            <div className="space-y-4 md:space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8">
                <h3 className="text-2xl font-bold text-midnight dark:text-white mb-6">Prérequis</h3>
                <ul className="space-y-3 md:space-y-4">
                  {atelier.prerequisites.map((prerequisite, idx) => (
                    <li key={idx} className="flex items-start gap-3 md:gap-4">
                      <Award className="w-5 h-5 md:w-6 md:h-6 text-gold flex-shrink-0 mt-0.5 md:mt-1" />
                      <span className="text-sm md:text-lg text-gray-700 dark:text-gray-300">
                        {prerequisite}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-gold/10 dark:bg-gold/5 rounded-2xl p-6 md:p-8 border border-gold/20">
                  <p className="text-lg font-bold text-midnight dark:text-white mb-2">Langue de l'atelier</p>
                  <p className="text-lg text-gold font-semibold">{atelier.language}</p>
                </div>
                <div className="bg-gold/10 dark:bg-gold/5 rounded-2xl p-6 md:p-8 border border-gold/20">
                  <p className="text-lg font-bold text-midnight dark:text-white mb-2">Format</p>
                  <p className="text-lg text-gold font-semibold flex items-center gap-2">
                    {atelier.isOnline ? (
                      <>
                        <Globe className="w-5 h-5" />
                        En ligne
                      </>
                    ) : (
                      <>
                        <MapPin className="w-5 h-5" />
                        Présentiel
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Instructor Tab */}
          {activeTab === 'instructor' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 shadow-lg">
                <div className="text-center mb-6 md:mb-8">
                  <img
                    src={atelier.instructor.image}
                    alt={atelier.instructor.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto mb-4 md:mb-6 object-cover"
                  />
                  <h3 className="text-2xl md:text-3xl font-bold text-midnight dark:text-white mb-2">
                    {atelier.instructor.name}
                  </h3>
                  <p className="text-lg text-gold font-semibold mb-4">{atelier.instructor.title}</p>
                </div>

                <div className="flex gap-3 justify-center">
                  <a
                    href={`mailto:contact@mideessi.com`}
                    className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold/90 text-midnight font-bold rounded-lg transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                  <a
                    href="https://wa.me/22900000000"
                    className="flex items-center gap-2 px-4 py-2 border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold/10 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8">
                <h4 className="text-xl md:text-2xl font-bold text-midnight dark:text-white mb-4">
                  À propos de l'instructeur
                </h4>
                <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {atelier.instructor.bio}
                </p>

                {atelier.testimonials && atelier.testimonials.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-bold text-midnight dark:text-white mb-4">Témoignages</h4>
                    <div className="space-y-4">
                      {atelier.testimonials.map((testimonial, idx) => (
                        <div
                          key={idx}
                          className="bg-gold/5 dark:bg-gold/10 rounded-lg p-4 border border-gold/20"
                        >
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 fill-gold text-gold"
                              />
                            ))}
                          </div>
                          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 italic mb-2">
                            "{testimonial.text}"
                          </p>
                          <p className="text-xs md:text-sm font-semibold text-midnight dark:text-white">
                            {testimonial.author} • {testimonial.role}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-midnight to-blue-900 dark:from-gray-900 dark:to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
            Vous avez des questions?
          </h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Notre équipe est disponible pour vous aider et répondre à toutes vos questions sur cet atelier.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-6 md:px-8 py-3 md:py-4 bg-gold text-midnight font-bold rounded-lg hover:bg-gold/90 transition-colors inline-flex items-center justify-center"
            >
              Nous contacter
            </a>
            <a
              href="/ateliers"
              className="px-6 md:px-8 py-3 md:py-4 border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold/10 transition-colors inline-flex items-center justify-center"
            >
              Voir les autres ateliers
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AtelierDetail;
