'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface Theme {
  bodyBackgroundColor: string;
  textColor: string;
}

interface ThemeContextType {
  currentTheme: string;
  setCurrentTheme: (themeName: string) => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themes: { [key: string]: Theme } = {
    light: { bodyBackgroundColor: '#e6e6e6', textColor: 'text-neutral-900'  },
    dark: { bodyBackgroundColor: 'rgba(16, 16, 16, 0.8)', textColor: 'text-white/80' },
    system: { bodyBackgroundColor: '#07070700', textColor: 'text-white/80' },
    ocean: { bodyBackgroundColor: '#1c2faa58', textColor: 'text-white/80'},
    glas: { bodyBackgroundColor: 'rgba(16, 16, 16, 0.8)', textColor: 'text-white/80' },
    red: { bodyBackgroundColor: '#50453F90', textColor: 'text-white/80' },
  };

  // Initialisiere das Theme aus dem localStorage oder verwende 'dark' als Fallback
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme || 'dark';
    }
    return 'dark';
  });

  // Aktualisiere localStorage wenn sich das Theme ändert
  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
    document.body.style.backgroundColor = themes[currentTheme].bodyBackgroundColor;
    // Entferne alle möglichen Textfarben-Klassen
    document.body.classList.remove('text-neutral-900', 'text-white');
    // Füge die neue Textfarben-Klasse hinzu
    document.body.classList.add(themes[currentTheme].textColor);
  }, [currentTheme]);

  const contextValue: ThemeContextType = {
    currentTheme,
    setCurrentTheme,
    theme: themes[currentTheme],
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};