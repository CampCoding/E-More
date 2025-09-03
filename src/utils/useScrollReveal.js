import { useEffect, useRef } from 'react';
import ScrollReveal from 'scrollreveal';

const useScrollReveal = (options = {}) => {
  const elementRef = useRef(null);
  const sr = useRef(null);

  useEffect(() => {
    // Initialize ScrollReveal
    sr.current = ScrollReveal({
      distance: '60px',
      duration: 1000,
      delay: 400,
      easing: 'cubic-bezier(0.5, 0, 0, 1)',
      reset: false,
      ...options
    });

    // Cleanup on unmount
    return () => {
      if (sr.current) {
        sr.current.destroy();
      }
    };
  }, [options]);

  const reveal = (customOptions = {}) => {
    if (elementRef.current && sr.current) {
      sr.current.reveal(elementRef.current, {
        ...options,
        ...customOptions
      });
    }
  };

  return [elementRef, reveal];
};

export default useScrollReveal; 