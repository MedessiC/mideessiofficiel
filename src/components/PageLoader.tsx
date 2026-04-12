import { useLoading } from '../contexts/LoadingContext';

const PageLoader = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <>
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[9998] h-1 bg-gold animate-pulse"></div>

      {/* Main Loader Overlay */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/75 dark:bg-gray-900/75 backdrop-blur-sm transition-opacity duration-300 animate-fade-in">
        {/* Container */}
        <div className="flex flex-col items-center justify-center gap-4">
          {/* Animated Spinner */}
          <div className="relative w-16 h-16">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>

            {/* Spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold border-r-gold animate-spin"></div>

            {/* Inner circle */}
            <div className="absolute inset-2 rounded-full bg-gold/10 dark:bg-gold/5 flex items-center justify-center">
              <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-semibold text-midnight dark:text-white">Chargement</p>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
              <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageLoader;
