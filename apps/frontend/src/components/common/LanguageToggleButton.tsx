import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

const LanguageToggleButton = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('es');

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/en/')) {
      setLanguage('en');
    } else if (path.includes('/es/')) {
      setLanguage('es');
    } else {
      const stored = localStorage.getItem('lang');
      if (stored === 'en' || stored === 'es') {
        setLanguage(stored);
      }
    }
  }, []);

  const handleClick = () => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
    localStorage.setItem('lang', newLang);

    const currentPath = window.location.pathname;
    let newPath;

    if (currentPath.includes('/en/')) {
      newPath = currentPath.replace('/en/', '/es/');
    } else if (currentPath.includes('/es/')) {
      newPath = currentPath.replace('/es/', '/en/');
    } else {
      newPath = `/${newLang}/`;
    }

    window.location.href = newPath;
  };

  return <Button onClick={handleClick}>{language.toUpperCase()}</Button>;
};

export default LanguageToggleButton;
