import { themes } from '../theme';

describe('theme', () => {
  it('mirrors web index.css light tokens', () => {
    expect(themes.light).toMatchObject({
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
      sans: "system-ui, 'Segoe UI', Roboto, sans-serif",
      heading: "system-ui, 'Segoe UI', Roboto, sans-serif",
      mono: 'ui-monospace, Consolas, monospace',
    });
  });

  it('mirrors web index.css dark tokens', () => {
    expect(themes.dark).toMatchObject({
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
      accentCtaText: '#201400',
      accentBg: 'rgba(211, 191, 100, 0.15)',
      accentBorder: 'rgba(211, 191, 100, 0.5)',
      tagBg: '#3a3520',
      tagText: '#dcd684',
      socialBg: 'rgba(47, 48, 58, 0.5)',
      danger: '#ff6b6b',
      radiusBtn: 13,
      radiusCard: 20,
    });
  });

  it('carries forward light values for tokens the dark block never redefines', () => {
    // --accent-2, --accent-5, and the font families aren't touched by web's
    // @media(prefers-color-scheme: dark) block, so the cascade keeps their
    // :root (light) values in dark mode too.
    expect(themes.dark.accent2).toBe(themes.light.accent2);
    expect(themes.dark.accent5).toBe(themes.light.accent5);
    expect(themes.dark.sans).toBe(themes.light.sans);
    expect(themes.dark.heading).toBe(themes.light.heading);
    expect(themes.dark.mono).toBe(themes.light.mono);
  });

  it('has identical shadow and radius token colors to web (card shadow uses text-h)', () => {
    expect(themes.light.shadowCard.shadowColor).toBe(themes.light.textH);
    expect(themes.dark.shadowCard.shadowColor).toBe('#000000');
    expect(themes.light.shadow.shadowColor).toBe('#000000');
    expect(themes.dark.shadow.shadowColor).toBe('#000000');
  });
});
