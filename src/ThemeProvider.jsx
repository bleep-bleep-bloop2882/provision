import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeCtx = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('provision_theme') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    let isDark = theme === 'dark';
    if (theme === 'system') {
      isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    if (isDark) {
      root.classList.remove('light');
    } else {
      root.classList.add('light');
    }
    localStorage.setItem('provision_theme', theme);
  }, [theme]);

  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const isDarkCurrent = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme, isDark: isDarkCurrent, toggle }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
