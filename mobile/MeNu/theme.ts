import { useThemeScheme } from '@/theme/useThemeScheme';

/**
 * Mobile's mirror of web's `frontend/src/index.css` CSS custom properties
 * (ADR-0006). Kept in sync by hand — RN can't consume CSS custom properties.
 *
 * Each two-layer CSS `box-shadow` token collapses to RN's single-shadow model
 * using its visually dominant layer (the one with the larger blur radius) —
 * both layers of a given token share the same base color, so no color is lost.
 */
export type ShadowTokens = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

export type ThemeTokens = {
  text: string;
  textH: string;
  textSoft: string;
  canvas: string;
  surface: string;
  bg: string;
  border: string;
  borderSubtle: string;
  codeBg: string;
  accent: string;
  accent2: string;
  accent5: string;
  accentCtaText: string;
  accentBg: string;
  accentBorder: string;
  tagBg: string;
  tagText: string;
  socialBg: string;
  danger: string;
  radiusBtn: number;
  radiusCard: number;
  shadow: ShadowTokens;
  shadowCard: ShadowTokens;
  shadowModal: ShadowTokens;
  // Not redefined in web's dark media query, so identical across schemes.
  sans: string;
  heading: string;
  mono: string;
};

const light: ThemeTokens = {
  text: '#6b6357',
  textH: '#211b0f',
  textSoft: '#948c7c',
  canvas: '#f7f4ea',
  surface: '#ffffff',
  bg: '#fff',
  border: '#e5e4e7',
  borderSubtle: 'rgba(33, 27, 15, 0.09)',
  codeBg: '#f4f3ec',
  accent: '#c68d29',
  accent2: '#d3bf64',
  accent5: '#bf7308',
  accentCtaText: '#201400',
  accentBg: 'rgba(198, 141, 41, 0.12)',
  accentBorder: 'rgba(198, 141, 41, 0.5)',
  tagBg: '#f2ecc9',
  tagText: '#6b5a1a',
  socialBg: 'rgba(244, 243, 236, 0.5)',
  danger: '#b3261e',
  radiusBtn: 13,
  radiusCard: 20,
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  shadowCard: {
    shadowColor: '#211b0f',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 6,
  },
  shadowModal: {
    shadowColor: '#211b0f',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.4,
    shadowRadius: 70,
    elevation: 10,
  },
  sans: "system-ui, 'Segoe UI', Roboto, sans-serif",
  heading: "system-ui, 'Segoe UI', Roboto, sans-serif",
  mono: 'ui-monospace, Consolas, monospace',
};

const dark: ThemeTokens = {
  text: '#a49b8a',
  textH: '#f3f1e9',
  textSoft: '#766c5c',
  canvas: '#15161b',
  surface: '#202129',
  bg: '#16171d',
  border: '#2e303a',
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  codeBg: '#1f2028',
  accent: '#d3bf64',
  // web's dark media query never redefines --accent-2/--accent-5, so the
  // cascade keeps their :root (light) values in dark mode too.
  accent2: light.accent2,
  accent5: light.accent5,
  accentCtaText: '#201400',
  accentBg: 'rgba(211, 191, 100, 0.15)',
  accentBorder: 'rgba(211, 191, 100, 0.5)',
  tagBg: '#3a3520',
  tagText: '#dcd684',
  socialBg: 'rgba(47, 48, 58, 0.5)',
  danger: '#ff6b6b',
  radiusBtn: light.radiusBtn,
  radiusCard: light.radiusCard,
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 4,
  },
  shadowCard: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 28,
    elevation: 6,
  },
  shadowModal: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.7,
    shadowRadius: 70,
    elevation: 10,
  },
  sans: light.sans,
  heading: light.heading,
  mono: light.mono,
};

export const themes: Record<'light' | 'dark', ThemeTokens> = { light, dark };

/** Named to avoid colliding with `@react-navigation/native`'s own `useTheme`. */
export function useAppTheme(): ThemeTokens {
  return themes[useThemeScheme().scheme];
}
