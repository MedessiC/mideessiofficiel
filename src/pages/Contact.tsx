import { useState } from 'react';
import { Mail, MapPin, Phone, Facebook, Linkedin, Github, Send } from 'lucide-react';

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

  return (
    <div className="min-h-screen pt-16">
      <section className="bg-gradient-to-br from-midnight to-blue-900 dark:from-black dark:to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Contactez-nous</h1>
          <p className="text-xl text-center text-gray-200 max-w-3xl mx-auto">
            Une question, une idée de collaboration ou simplement envie d'échanger ? Nous sommes à votre écoute.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-midnight dark:text-white mb-6">
                Envoyez-nous un message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold focus:border-transparent transition-colors"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold focus:border-transparent transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold focus:border-transparent transition-colors resize-none"
                    placeholder="Votre message..."
                  />
                </div>

                {submitMessage && (
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
                    <p className="text-green-800 dark:text-green-400">{submitMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gold hover:bg-yellow-500 text-midnight font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}</span>
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-midnight dark:text-white mb-6">
                Informations de contact
              </h2>

              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight dark:text-white mb-1">Email</h3>
                    <a
                      href="mailto:contact@mideessi.com"
                      className="text-gray-600 dark:text-gray-300 hover:text-gold transition-colors"
                    >
                      contact@mideessi.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight dark:text-white mb-1">Téléphone</h3>
                    <p className="text-gray-600 dark:text-gray-300">+229 XX XX XX XX</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight dark:text-white mb-1">Localisation</h3>
                    <p className="text-gray-600 dark:text-gray-300">Cotonou, Bénin</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-midnight dark:text-white mb-4">
                  Suivez-nous
                </h3>
                <div className="flex space-x-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-midnight dark:bg-white rounded-lg flex items-center justify-center hover:bg-gold transition-colors group"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-6 h-6 text-white dark:text-midnight group-hover:text-midnight" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-midnight dark:bg-white rounded-lg flex items-center justify-center hover:bg-gold transition-colors group"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-6 h-6 text-white dark:text-midnight group-hover:text-midnight" />
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-midnight dark:bg-white rounded-lg flex items-center justify-center hover:bg-gold transition-colors group"
                    aria-label="GitHub"
                  >
                    <Github className="w-6 h-6 text-white dark:text-midnight group-hover:text-midnight" />
                  </a>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-bold text-midnight dark:text-white mb-3">
                  Horaires de disponibilité
                </h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p>Lundi - Vendredi: 9h00 - 18h00</p>
                  <p>Samedi: 10h00 - 14h00</p>
                  <p>Dimanche: Fermé</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-midnight dark:text-white mb-6">
            Vous avez un projet en tête ?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Nous sommes toujours ravis de discuter de nouvelles opportunités de collaboration.
            Que vous ayez un projet précis ou simplement une idée, n'hésitez pas à nous contacter.
            Notre équipe vous répondra dans les plus brefs délais.
          </p>
          <p className="text-gold font-semibold text-lg">
            MIDEESSI - Nous sommes indépendants
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
