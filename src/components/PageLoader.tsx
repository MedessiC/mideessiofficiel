import { useLoading } from '../contexts/LoadingContext';

const PageLoader = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <>
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[9998] h-[3px] bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 animate-pulse"></div>

      {/* Main Loader Overlay */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-[#191970]/80 backdrop-blur-md transition-opacity duration-300">
        {/* Glow effect in background */}
        <div className="absolute w-72 h-72 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

        {/* Container */}
        <div className="flex flex-col items-center justify-center gap-6 relative z-10">
          {/* Animated Logo Container */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Spinning Golden Orbit Track */}
            <div className="absolute inset-0 rounded-full border-[3px] border-gray-100 dark:border-[#1e2a4a]"></div>
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-yellow-500 border-r-yellow-500 animate-spin" style={{ animationDuration: '1.2s' }}></div>
            
            {/* Inner Ring Glow */}
            <div className="absolute inset-1.5 rounded-full border border-yellow-400/20 animate-ping" style={{ animationDuration: '2s' }}></div>

            {/* Logo Image wrapper with soft pulse scale */}
            {/* In light mode: BG is white, container of logo is dark blue (#0a0f1e) with light logo. */}
            {/* In dark mode: BG is #191970, container of logo is white with dark logo (mideessi.webp). */}
            <div className="absolute inset-3 rounded-full bg-[#0a0f1e] dark:bg-white flex items-center justify-center shadow-lg border border-gray-200/10 dark:border-white/5 overflow-hidden p-3 animate-pulse">
              <img 
                src="/mideessi.webp" 
                alt="Logo Mideessi" 
                className="w-full h-full object-contain dark:hidden"
              />
              <img 
                src="/mideessi-light.webp" 
                alt="Logo Mideessi" 
                className="w-full h-full object-contain hidden dark:block"
              />
            </div>
          </div>

          {/* Premium micro text indicators */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <p className="text-xs uppercase tracking-[0.25em] font-black text-gray-800 dark:text-white/90">MIDEESSI</p>
            <p className="text-[10px] text-yellow-500 dark:text-yellow-400 font-bold animate-pulse">Traitement en cours</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageLoader;
