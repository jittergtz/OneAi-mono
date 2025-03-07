// src/context/ThemeProvider.tsx
'use client'; 

import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Define Theme Type
interface Theme {
  bodyBackgroundColor: string;
  // You can add more theme properties here like text color, accent color, etc.
}

// 2. Define Theme Context Type
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// 3. Create Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 4. Theme Provider Component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initial Themes (for testing - you can expand these)
  const themes: { [key: string]: Theme } = {
    light: { bodyBackgroundColor: '#f0f0f0' }, // Light gray
    dark: { bodyBackgroundColor: '#333333' },   // Dark gray
    blue: { bodyBackgroundColor: '#e0f7fa' },   // Light blue
    green: { bodyBackgroundColor: '#e8f5e9' },  // Light green
  };

  // State to hold the current theme (default to 'light' for now)
  const [currentThemeName, setCurrentThemeName] = useState<string>('light'); // Start with 'light' theme
  const currentTheme = themes[currentThemeName];

  // Function to set the theme
  const setThemeName = (themeName: string) => {
    setCurrentThemeName(themeName);
  };

  const contextValue: ThemeContextType = {
    theme: currentTheme,
    setTheme: (theme: Theme) => {
      // Find the theme name corresponding to the provided theme object
      const themeEntry = Object.entries(themes).find(([, themeObj]) => themeObj === theme);
      if (themeEntry) {
        setThemeName(themeEntry[0]); // Set theme name based on found entry
      } else {
        console.warn("Provided theme object not found in themes list.");
      }
    },
  };


  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// 5. Custom Hook to use the Theme Context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};