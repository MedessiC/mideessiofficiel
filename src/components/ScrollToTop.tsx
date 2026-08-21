import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef(new Map<string, number>());

  useEffect(() => {
    const { key, hash } = location;
    let animationFrameId: number | undefined;
    let isActive = true;

    if (navigationType === 'POP') {
      const savedPosition = scrollPositions.current.get(key);
      window.scrollTo({ top: savedPosition ?? 0, left: 0, behavior: 'auto' });
    } else if (hash) {
      let attempts = 0;
      const scrollToAnchor = () => {
        const target = document.getElementById(hash.slice(1));
        if (target) {
          target.scrollIntoView({ behavior: 'auto', block: 'start' });
        } else if (isActive && attempts++ < 10) {
          animationFrameId = window.requestAnimationFrame(scrollToAnchor);
        }
      };
      scrollToAnchor();
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }

    return () => {
      isActive = false;
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      scrollPositions.current.set(key, window.scrollY);
    };
  }, [location, navigationType]);

  return null;
};

export default ScrollToTop;
