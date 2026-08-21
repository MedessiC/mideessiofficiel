import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

const ADSENSE_SCRIPT_ID = 'adsense-script';

const loadAdvertising = () => {
  if (document.getElementById(ADSENSE_SCRIPT_ID)) return;

  const script = document.createElement('script');
  script.id = ADSENSE_SCRIPT_ID;
  script.async = true;
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2477743008037360';
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
};

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted') {
      loadAdvertising();
    } else if (!consent) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    loadAdvertising();
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-gray-200 bg-white px-4 py-3 shadow-2xl animate-slide-up dark:border-gray-700 dark:bg-gray-900 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center md:gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="mt-0.5 h-6 w-6 flex-shrink-0 text-blue-600 sm:mt-1 sm:h-8 sm:w-8" />
            <div>
              <h3 className="mb-1 text-base font-bold text-gray-900 dark:text-white sm:mb-2 sm:text-lg">
                Nous utilisons des cookies
              </h3>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 sm:text-sm">
                Ce site utilise des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu.
                En cliquant sur "Accepter", vous consentez à l'utilisation de tous les cookies.
              </p>
            </div>
          </div>
          <div className="flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-3 flex-shrink-0">
            <button
              onClick={declineCookies}
              className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white sm:px-4"
            >
              Refuser
            </button>
            <button
              onClick={acceptCookies}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700 sm:px-6"
            >
              Accepter
            </button>
            <button
              onClick={declineCookies}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 sm:p-2"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
