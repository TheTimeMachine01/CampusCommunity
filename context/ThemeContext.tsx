import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useColorScheme as useColorSchemeRN } from 'react-native';

type ThemeOption = 'system' | 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeOption;
  setTheme: (t: ThemeOption) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const deviceScheme = useColorSchemeRN();
  const [theme, setThemeState] = useState<ThemeOption>('system');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await SecureStore.getItemAsync('appTheme');
        console.log('ThemeProvider: Loaded theme from storage:', stored, 'Type:', typeof stored);
        
        // Validate that stored value is actually a string and a valid theme option
        if (typeof stored === 'string' && (stored === 'light' || stored === 'dark' || stored === 'system')) {
          setThemeState(stored);
        } else if (stored === null || stored === undefined) {
          // No stored theme, use default 'system'
          setThemeState('system');
        } else {
          console.warn('ThemeProvider: Invalid theme value stored:', stored, 'Type:', typeof stored);
          // Clear invalid value
          try {
            await SecureStore.deleteItemAsync('appTheme');
          } catch (e) {
            console.error('Failed to delete invalid theme:', e);
          }
          setThemeState('system');
        }
      } catch (e) {
        console.warn('ThemeProvider: failed to load stored theme', e);
        setThemeState('system');
      } finally {
        setIsInitialized(true);
      }
    };
    load();
  }, []);

  const setTheme = async (t: ThemeOption) => {
    try {
      // Ensure we're storing a string, not a boolean or any other type
      const themeToStore = String(t);
      console.log('ThemeProvider: Setting theme to:', themeToStore, 'Type:', typeof themeToStore);
      
      if (themeToStore !== 'light' && themeToStore !== 'dark' && themeToStore !== 'system') {
        throw new Error(`Invalid theme value: ${themeToStore}`);
      }
      
      await SecureStore.setItemAsync('appTheme', themeToStore);
      setThemeState(t);
    } catch (e) {
      console.warn('ThemeProvider: failed to save theme', e);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used within ThemeProvider');
  return ctx;
}

export function useResolvedColorScheme(): 'light' | 'dark' {
  const device = useColorSchemeRN();
  const ctx = useContext(ThemeContext);
  
  // Determine the actual theme to use
  let themeToUse: ThemeOption = ctx?.theme ?? 'system';
  if (themeToUse === 'system') {
    themeToUse = device ?? 'light'; // Default to light if device scheme is null
  }
  
  // Ensure we always return 'light' or 'dark', never null
  return (themeToUse === 'dark') ? 'dark' : 'light';
}
