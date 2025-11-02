import { useState } from 'react';
import { Mail, MapPin, Phone, Facebook, Github, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center tracking-tight">
            <span className="text-yellow-400">Contactez</span>-nous
          </h1>
          <p className="text-xl md:text-2xl text-center text-gray-200 max-w-3xl mx-auto font-light">
            Une question, une idée de collaboration ou simplement envie d'échanger ? Nous sommes à votre écoute.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-xl p-8 md:p-10">
              <h2 className="text-3xl font-bold text-blue-900 mb-2">
                Envoyez-nous un message
              </h2>
              <div className="w-20 h-1 bg-yellow-500 rounded-full mb-8"></div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all resize-none"
                    placeholder="Votre message..."
                  />
                </div>

                {submitStatus.message && (
                  <div className={`p-4 rounded-xl flex items-start gap-3 ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-50 border-2 border-green-300' 
                      : 'bg-red-50 border-2 border-red-300'
                  }`}>
                    {submitStatus.type === 'success' ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`font-medium ${
                      submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {submitStatus.message}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-blue-900 font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:from-yellow-500 disabled:hover:to-yellow-600"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Envoyer le message</span>
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-blue-900 mb-2">
                  Informations de contact
                </h2>
                <div className="w-20 h-1 bg-yellow-500 rounded-full mb-8"></div>
                
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div 
                      key={index}
                      className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300"
                    >
                      <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-blue-900 mb-1 text-lg">{info.title}</h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-gray-600 hover:text-yellow-600 transition-colors"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-gray-600">{info.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-blue-900 mb-6">
                  Suivez-nous
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-blue-900 rounded-2xl flex items-center justify-center hover:bg-yellow-500 transition-all duration-300 group transform hover:scale-110 shadow-md hover:shadow-lg"
                      aria-label={social.label}
                    >
                      <div className="text-white group-hover:text-blue-900 transition-colors">
                        {social.icon}
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-3xl p-8 shadow-lg text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    Horaires de disponibilité
                  </h3>
                </div>
                <div className="space-y-3 text-gray-200">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="font-medium">Lundi - Vendredi</span>
                    <span className="text-yellow-400 font-semibold">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="font-medium">Samedi</span>
                    <span className="text-yellow-400 font-semibold">10h00 - 14h00</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Dimanche</span>
                    <span className="text-gray-400">Fermé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Vous avez un projet en tête ?
          </h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Nous sommes toujours ravis de discuter de nouvelles opportunités de collaboration.
            Que vous ayez un projet précis ou simplement une idée, n'hésitez pas à nous contacter.
            Notre équipe vous répondra dans les plus brefs délais.
          </p>
          <div className="inline-block bg-yellow-100 border-2 border-yellow-500 rounded-full px-8 py-4">
            <p className="text-xl font-bold text-yellow-600">
              MIDEESSI - Nous sommes indépendants
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;