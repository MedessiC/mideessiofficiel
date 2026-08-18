import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    try {
      // Force immediate jump to top on route change to mimic <a href> behavior
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    } catch (err) {
      // ignore
    }
  // we intentionally ignore hash here to always go to top on navigation
  }, [pathname]);

  return null;
};

export default ScrollToTop;
