import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import SunIcon from '../../assets/sun.svg?react';
import MoonIcon from '../../assets/moon.svg?react';

interface Props {
  initialTheme?: 'light' | 'dark';
}

const ThemeToggleButton: React.FC<Props> = ({ initialTheme }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') as 'light' | 'dark';
    }
    if (
      typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark')
    ) {
      return 'dark';
    }
    if (initialTheme) {
      return initialTheme;
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleClick = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button onClick={handleClick}>
        <div className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Button onClick={handleClick}>
      {theme === 'light' ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};

export default ThemeToggleButton;
