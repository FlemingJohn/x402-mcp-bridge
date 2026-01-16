
import { useState, useEffect } from 'react';

export const useActiveSection = (sectionIds: string[], offset: string = '-10% 0px -10% 0px') => {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: offset,
      threshold: 0.3
    };

    const observers = sectionIds.map(id => {
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setActiveSection(id);
        }
      }, observerOptions);

      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach(obs => obs?.disconnect());
    };
  }, [sectionIds, offset]);

  return activeSection;
};
