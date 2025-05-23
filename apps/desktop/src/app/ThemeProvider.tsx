'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface Theme {
  bodyBackgroundColor: string;
  textColor: string;
  borderColor?: string;
  placeholderColor?: string;
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
    light: { bodyBackgroundColor: 'linear-gradient(180deg, #F5F5F5 10%, #E8E8E8 100%)', textColor: 'text-black/70', borderColor: 'border-black/20', placeholderColor: "placeholder:text-black/60" },
    dark: { bodyBackgroundColor: '#101010', textColor: 'text-white/80', borderColor: 'border-white/10' },
    system: { bodyBackgroundColor: '#00000000', textColor: 'text-white/80', borderColor: 'border-neutral-700' },
    glas: { bodyBackgroundColor: 'linear-gradient(135deg, #FDFDFD40 50%, #A0A0BD90 100%)', textColor: 'text-white/80' },
    carbon: { bodyBackgroundColor: 'linear-gradient(135deg, #070707 50%, #1E1E1E 130%)', textColor: 'text-white/90', borderColor: 'border-white/10' },
 
    red: { bodyBackgroundColor: 'linear-gradient(135deg, #370A0E90 50%, #d12c63 130%)', textColor: 'text-white/80', borderColor: 'border-white/10' },
    ocean: { bodyBackgroundColor: 'linear-gradient(135deg, #080D47 20%, #1F2670 100%)', textColor: 'text-white/80', borderColor: 'border-blue-200/20'},
    sky: { bodyBackgroundColor: 'linear-gradient(135deg, #8989F1 50%, #0F0F6F 100%)', textColor: 'text-white/80', borderColor: 'border-white/20'},
    elo: { bodyBackgroundColor: 'linear-gradient(35deg, #4B888C 70%, #6CB0B5 100%)', textColor: 'text-white/90', borderColor: 'border-white/10' },
   
    stone: { bodyBackgroundColor: 'linear-gradient(180deg, #436591 90%, #371C1C 100%)', textColor: 'text-white/90', borderColor: 'border-white/10' },
    lava: { bodyBackgroundColor: 'linear-gradient(180deg, #1C1817 10%, #371C1C 100%)', textColor: 'text-white/90', borderColor: 'border-white/10' },
    prime: { bodyBackgroundColor: 'linear-gradient(180deg, #AFC5E1 10%, #D5E4F7 100%)', textColor: 'text-black/70', borderColor: 'border-white/10', placeholderColor: "placeholder:text-black/60" },
    yacht: { bodyBackgroundColor: 'linear-gradient(18deg, #3F4248 50%, #505A67 140%)', textColor: 'text-white/90', borderColor: 'border-white/10' },
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

      document.body.style.background = themes[currentTheme].bodyBackgroundColor;

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