import React, {createContext, useContext, useMemo} from 'react';
import {useColorScheme} from 'react-native';
import {Theme, lightTheme, darkTheme} from './themes';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const value = useMemo(
    () => ({
      theme: isDark ? darkTheme : lightTheme,
      isDark,
    }),
    [isDark],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
