import { useState } from 'react';
import { Mail, MapPin, Phone, Facebook, Linkedin, Github, Send, Clock } from 'lucide-react';
import SEO from '../components/SEO';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    setTimeout(() => {
      setSubmitMessage('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-gold" />,
      title: 'Email',
      content: 'contact@mideessi.com',
      link: 'mailto:contact@mideessi.com',
    },
    {
      icon: <Phone className="w-6 h-6 text-gold" />,
      title: 'Téléphone',
      content: '+229 XX XX XX XX',
      link: null,
    },
    {
      icon: <MapPin className="w-6 h-6 text-gold" />,
      title: 'Localisation',
      content: 'Cotonou, Bénin',
      link: null,
    },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-6 h-6" />, url: 'https://facebook.com', label: 'Facebook' },
    { icon: <Linkedin className="w-6 h-6" />, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <Github className="w-6 h-6" />, url: 'https://github.com', label: 'GitHub' },
  ];

  return (
    <div className="min-h-screen pt-16">
      <SEO
        title="Contactez-nous | MIDEESSI"
        description="Contactez l'équipe MIDEESSI pour discuter de vos projets, poser vos questions ou simplement échanger sur l'innovation technologique. Nous sommes à votre écoute."
        keywords={['contact', 'MIDEESSI', 'support', 'collaboration', 'Cotonou', 'Bénin']}
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center tracking-tight">
            <span className="text-gold">Contactez</span>-nous
          </h1>
          <p className="text-xl md:text-2xl text-center text-gray-200 max-w-3xl mx-auto font-light">
            Une question, une idée de collaboration ou simplement envie d'échanger ? Nous sommes à votre écoute.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl p-8 md:p-10">
              <h2 className="text-3xl font-bold text-midnight dark:text-white mb-2">
                Envoyez-nous un message
              </h2>
              <div className="w-20 h-1 bg-gold rounded-full mb-8"></div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold focus:border-gold transition-all resize-none"
                    placeholder="Votre message..."
                  />
                </div>

                {submitMessage && (
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700 rounded-xl animate-fade-in">
                    <p className="text-green-800 dark:text-green-400 font-medium">{submitMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-midnight font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}</span>
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-midnight dark:text-white mb-2">
                  Informations de contact
                </h2>
                <div className="w-20 h-1 bg-gold rounded-full mb-8"></div>
                
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div 
                      key={index}
                      className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-gold/20 to-gold/5 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-midnight dark:text-white mb-1 text-lg">{info.title}</h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-gray-600 dark:text-gray-300 hover:text-gold transition-colors"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-gray-600 dark:text-gray-300">{info.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-midnight dark:text-white mb-6">
                  Suivez-nous
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-midnight dark:bg-white rounded-2xl flex items-center justify-center hover:bg-gold transition-all duration-300 group transform hover:scale-110 shadow-md hover:shadow-lg"
                      aria-label={social.label}
                    >
                      <div className="text-white dark:text-midnight group-hover:text-midnight transition-colors">
                        {social.icon}
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="bg-gradient-to-br from-midnight to-blue-900 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-lg text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gold/20 rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    Horaires de disponibilité
                  </h3>
                </div>
                <div className="space-y-3 text-gray-200">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="font-medium">Lundi - Vendredi</span>
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
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-midnight dark:text-white mb-4">
            Vous avez un projet en tête ?
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Nous sommes toujours ravis de discuter de nouvelles opportunités de collaboration.
            Que vous ayez un projet précis ou simplement une idée, n'hésitez pas à nous contacter.
            Notre équipe vous répondra dans les plus brefs délais.
          </p>
          <div className="inline-block bg-gold/10 backdrop-blur-sm border-2 border-gold rounded-full px-8 py-4">
            <p className="text-xl font-bold text-gold">
              MIDEESSI - Nous sommes indépendants
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;