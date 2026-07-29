import { createContext } from 'react';

export type ThemeScheme = 'light' | 'dark';

export interface ThemeSchemeState {
  scheme: ThemeScheme;
  toggleScheme: () => void;
}

export const ThemeSchemeContext = createContext<ThemeSchemeState | undefined>(undefined);
