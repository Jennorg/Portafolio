import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

interface Props {
  initialPath?: string;
}

const LanguageToggleButton = ({ initialPath = '' }: Props) => {
  const [path, setPath] = useState(initialPath);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPath(window.location.pathname);
    }
  }, []);

  const isEnglish = path.startsWith('/en/');
  const isSpanish = path.startsWith('/es/');

  let currentLang: 'en' | 'es' = 'es';
  if (isEnglish) currentLang = 'en';
  else if (isSpanish) currentLang = 'es';

  let targetPath = path;
  if (isEnglish) {
    targetPath = path.replace('/en/', '/es/');
  } else if (isSpanish) {
    targetPath = path.replace('/es/', '/en/');
  } else {
    targetPath = currentLang === 'en' ? '/es/' : '/en/';
  }

  return (
    <Button href={targetPath} data-astro-prefetch="hover">
      {currentLang.toUpperCase()}
    </Button>
  );
};

export default LanguageToggleButton;
