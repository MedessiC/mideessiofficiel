import { Home, ArrowLeft, Search, FileQuestion } from 'lucide-react';

const NotFound = () => {
  const quickLinks = [
    { to: '/', label: 'Accueil', icon: <Home className="w-4 h-4" /> },
    { to: '/about', label: 'À propos', icon: <Search className="w-4 h-4" /> },
    { to: '/projects', label: 'Nos Solutions', icon: <FileQuestion className="w-4 h-4" /> },
    { to: '/blog', label: 'Blog', icon: <Search className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-6">
              <span className="text-gold text-8xl md:text-9xl font-bold">404</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-midnight dark:text-white mb-4">
              Page non trouvée
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Oups ! La page que vous recherchez semble avoir disparu dans le cyberespace.
              Elle a peut-être été déplacée, supprimée ou n'a jamais existé.
            </p>

            <div className="space-y-4 mb-8">
              <p className="text-gray-700 dark:text-gray-400">
                Voici quelques suggestions pour retrouver votre chemin :
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  <span>Vérifiez l'URL pour vous assurer qu'elle est correcte</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  <span>Retournez à la page d'accueil et naviguez depuis là</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">•</span>
                  <span>Utilisez notre menu de navigation pour explorer le site</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/"
                className="inline-flex items-center justify-center space-x-2 bg-gold hover:bg-yellow-500 text-midnight font-semibold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
              >
                <Home className="w-5 h-5" />
                <span>Retour à l'accueil</span>
              </a>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center space-x-2 bg-midnight dark:bg-white text-white dark:text-midnight hover:bg-opacity-90 font-semibold px-6 py-3 rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Page précédente</span>
              </button>
            </div>
          </div>

          {/* Image pour grand écran */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 max-w-md mx-auto">
              <img
                src="/404-image.webp"
                alt="Page non trouvée"
                className="rounded-lg shadow-2xl w-full h-auto object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-midnight/20 to-transparent rounded-lg"></div>
            </div>
            <div className="absolute -top-4 -right-4 w-48 h-48 bg-gold/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
          </div>
          
          {/* Image pour mobile/tablette */}
          <div className="relative lg:hidden mt-8">
            <div className="relative z-10 max-w-sm mx-auto">
              <img
                src="/404-image.webp"
                alt="Page non trouvée"
                className="rounded-lg shadow-xl w-full h-auto object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-midnight/20 to-transparent rounded-lg"></div>
            </div>
            <div className="absolute -top-2 -right-2 w-32 h-32 bg-gold/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-2 -left-2 w-28 h-28 bg-blue-500/20 rounded-full blur-2xl"></div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-midnight dark:text-white mb-6 text-center">
            Liens rapides
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                className="flex items-center justify-center space-x-2 bg-gray-50 dark:bg-gray-800 hover:bg-gold hover:text-midnight dark:hover:bg-gold dark:hover:text-midnight text-gray-700 dark:text-gray-300 font-medium px-4 py-3 rounded-lg transition-all transform hover:scale-105"
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Vous pensez qu'il s'agit d'une erreur ?
          </p>
          <Link
            to="/contact"
            className="text-gold hover:text-midnight dark:hover:text-white font-semibold transition-colors"
          >
            Contactez-nous pour nous le signaler
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;