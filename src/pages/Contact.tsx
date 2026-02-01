import { useState } from 'react';
import { Mail, MapPin, Phone, Facebook, Github, Send, Clock, CheckCircle, AlertCircle, MessageCircle, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  // CONFIGURATION : Remplacez par votre endpoint
  const FORM_ENDPOINT = 'https://formspree.io/f/mpwoqyaw'; // Remplacez YOUR_FORM_ID

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Effacer le message de statut lors de la modification
    if (submitStatus.message) {
      setSubmitStatus({ type: '', message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.'
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou nous contacter directement par email.'
      });
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-yellow-600" />,
      title: 'Email',
      content: 'contact@mideessi.com',
      link: 'mailto:contact@mideessi.com',
    },
    {
      icon: <Phone className="w-6 h-6 text-yellow-600" />,
      title: 'Téléphone',
      content: '+229 01 64 40 96 91',
      link: 'tel:+2290164409691',
    },
    {
      icon: <MapPin className="w-6 h-6 text-yellow-600" />,
      title: 'Localisation',
      content: 'Cotonou, Bénin',
      link: 'https://www.google.com/maps/place/Cotonou,+B%C3%A9nin',
    },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-6 h-6" />, url: 'https://web.facebook.com/profile.php?id=61578393594703', label: 'Facebook' },
    { icon: <Github className="w-6 h-6" />, url: 'https://github.com', label: 'GitHub' },
  ];

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
      <SEO
        title="Contact MIDEESSI | Nous contacter"
        description="Vous avez une question, une idée de collaboration ou simplement envie d'échanger ? Contactez-nous à Cotonou, Bénin."
        keywords={['contact', 'collaboration', 'MIDEESSI', 'Bénin', 'email', 'téléphone']}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white py-12 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-5 md:top-20 md:right-10 w-40 h-40 md:w-72 md:h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-5 md:bottom-20 md:left-10 w-48 h-48 md:w-96 md:h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 tracking-tight">
              <span className="text-gold">Contactez</span>-nous
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed px-2">
              Une question, une idée de collaboration ou simplement envie d'échanger ? Nous sommes à votre écoute.
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8 lg:p-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight dark:text-white mb-2 md:mb-3">
                Envoyez-nous un message
              </h2>
              <div className="w-12 sm:w-16 md:w-20 h-1 bg-gold rounded-full mb-6 md:mb-8"></div>
              
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 md:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold focus:border-gold dark:focus:border-gold transition-all text-sm md:text-base"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 md:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold focus:border-gold dark:focus:border-gold transition-all text-sm md:text-base"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2.5 md:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold focus:border-gold dark:focus:border-gold transition-all resize-none text-sm md:text-base"
                    placeholder="Votre message..."
                  />
                </div>

                {submitStatus.message && (
                  <div className={`p-4 rounded-xl flex items-start gap-3 ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-50 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700' 
                      : 'bg-red-50 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700'
                  }`}>
                    {submitStatus.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`font-medium text-sm md:text-base ${
                      submitStatus.type === 'success' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                    }`}>
                      {submitStatus.message}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gold hover:bg-yellow-500 text-midnight font-bold px-6 md:px-8 py-2.5 md:py-3 lg:py-4 rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm md:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Envoyer le message</span>
                      <Send className="w-4 h-4 md:w-5 md:h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6 md:space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-midnight dark:text-white mb-2 md:mb-3">
                  Informations de contact
                </h2>
                <div className="w-12 sm:w-16 md:w-20 h-1 bg-gold rounded-full mb-6 md:mb-8"></div>
                
                <div className="space-y-4 md:space-y-6">
                  {contactInfo.map((info, index) => (
                    <div 
                      key={index}
                      className="group flex items-start gap-3 md:gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                    >
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-gold/10 group-hover:bg-gold/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-midnight dark:text-white mb-1 text-sm md:text-base lg:text-lg">{info.title}</h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-gray-600 dark:text-gray-400 hover:text-gold dark:hover:text-gold transition-colors text-xs md:text-sm"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">{info.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="bg-gradient-to-br from-midnight to-blue-900 dark:from-midnight dark:to-gray-800 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg text-white">
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gold/20 rounded-lg md:rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-gold" />
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold">
                    Horaires
                  </h3>
                </div>
                <div className="space-y-2 md:space-y-3 text-gray-200 text-sm md:text-base">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="font-medium">Lun - Ven</span>
                    <span className="text-gold font-semibold">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="font-medium">Samedi</span>
                    <span className="text-gold font-semibold">10h00 - 14h00</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Dimanche</span>
                    <span className="text-gray-400">Fermé</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg">
                <h3 className="text-lg md:text-xl font-bold text-midnight dark:text-white mb-4 md:mb-6">
                  Suivez-nous
                </h3>
                <div className="flex gap-3 md:gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 md:w-14 md:h-14 bg-midnight dark:bg-white rounded-lg md:rounded-xl flex items-center justify-center hover:bg-gold hover:text-midnight dark:hover:bg-gold dark:hover:text-midnight transition-all duration-300 group transform hover:scale-110 shadow-md hover:shadow-lg"
                      aria-label={social.label}
                    >
                      <div className="text-white dark:text-midnight group-hover:text-midnight dark:group-hover:text-white transition-colors">
                        {social.icon}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 md:py-16 lg:py-24 bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 lg:mb-6">
            Vous avez un projet en tête ?
          </h2>
          <div className="w-12 sm:w-16 md:w-20 h-1 bg-gold mx-auto rounded-full mb-6 md:mb-8"></div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-6 md:mb-8 lg:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            Nous sommes toujours ravis de discuter de nouvelles opportunités de collaboration.
            Que vous ayez un projet précis ou simplement une idée, n'hésitez pas à nous contacter.
            Notre équipe vous répondra dans les plus brefs délais.
          </p>
          <div className="inline-block bg-gold/20 backdrop-blur-sm border-2 border-gold rounded-full px-6 md:px-8 py-3 md:py-4">
            <p className="text-base md:text-lg lg:text-xl font-bold text-gold">
              MIDEESSI - Nous sommes indépendants
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;