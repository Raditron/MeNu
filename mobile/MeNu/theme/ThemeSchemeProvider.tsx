import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { useColorScheme } from '@/components/useColorScheme';
import { ThemeSchemeContext } from './ThemeSchemeContext';
import type { ThemeScheme } from './ThemeSchemeContext';

const STORAGE_KEY = 'menu.themeScheme';

export function ThemeSchemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<ThemeScheme | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark') {
        setOverride(stored);
      }
    });
  }, []);

  const scheme = override ?? systemScheme;

  const toggleScheme = () => {
    const next: ThemeScheme = scheme === 'dark' ? 'light' : 'dark';
    setOverride(next);
    void AsyncStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <ThemeSchemeContext.Provider value={{ scheme, toggleScheme }}>{children}</ThemeSchemeContext.Provider>
  );
}
