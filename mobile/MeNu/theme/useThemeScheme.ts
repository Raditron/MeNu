import { useContext } from 'react';

import { ThemeSchemeContext } from './ThemeSchemeContext';

export function useThemeScheme() {
  const scheme = useContext(ThemeSchemeContext);

  if (!scheme) {
    throw new Error('useThemeScheme must be used within a ThemeSchemeProvider');
  }

  return scheme;
}
