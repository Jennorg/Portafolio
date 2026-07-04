import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

const LanguageToggleButton = () => {
  const [lang, setLang] = useState<'es' | 'en'>('es');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const htmlLang = document.documentElement.getAttribute('data-lang') as 'es' | 'en';
      setLang(htmlLang || 'es');
    }

    // ponytail: handle back/forward navigation or custom route changes to sync UI state
    const handlePopState = () => {
      const urlLang = window.location.pathname.split('/')[1];
      const newLang = urlLang === 'en' ? 'en' : 'es';
      document.documentElement.setAttribute('data-lang', newLang);
      setLang(newLang);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [lang]);

  const handleLangToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextLang = lang === 'es' ? 'en' : 'es';
    
    if (typeof window !== 'undefined') {
      // ponytail: toggle HTML attribute for instant CSS translation swap (0ms, no flash)
      document.documentElement.setAttribute('data-lang', nextLang);
      localStorage.setItem('lang', nextLang);

      // Silently sync address bar URL without triggering Astro request
      const currentPath = window.location.pathname;
      const nextPath = currentPath.includes(`/${lang}/`)
        ? currentPath.replace(`/${lang}/`, `/${nextLang}/`)
        : `/${nextLang}/`;
      window.history.pushState({}, '', nextPath);

      setLang(nextLang);
    }
  };

  return (
    <Button onClick={handleLangToggle}>
      {lang.toUpperCase()}
    </Button>
  );
};

export default LanguageToggleButton;
