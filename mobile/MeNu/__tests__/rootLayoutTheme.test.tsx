import { screen } from 'expo-router/testing-library';
import { renderApp } from '../test/renderApp';
import { themes } from '../theme';
import { useColorScheme } from '../components/useColorScheme';

jest.mock('../components/useColorScheme', () => ({
  useColorScheme: jest.fn(),
}));

/** Collects every `backgroundColor` found anywhere in a rendered JSON tree's styles. */
function collectBackgroundColors(node: unknown, found: string[] = []): string[] {
  if (Array.isArray(node)) {
    node.forEach((child) => collectBackgroundColors(child, found));
    return found;
  }
  if (node == null || typeof node !== 'object') {
    return found;
  }
  const { props, children } = node as { props?: { style?: unknown }; children?: unknown };
  const style = props?.style;
  for (const s of Array.isArray(style) ? style.flat(Infinity) : [style]) {
    if (s && typeof s === 'object' && 'backgroundColor' in s) {
      found.push((s as { backgroundColor: string }).backgroundColor);
    }
  }
  collectBackgroundColors(children, found);
  return found;
}

describe.each(['light', 'dark'] as const)('root layout theme wiring (%s)', (scheme) => {
  it(`paints the shell background with the ${scheme} canvas token`, async () => {
    (useColorScheme as jest.Mock).mockReturnValue(scheme);
    await renderApp('/');

    const backgrounds = collectBackgroundColors(screen.toJSON());
    expect(backgrounds).toContain(themes[scheme].canvas);
  });
});
