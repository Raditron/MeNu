import { renderRouter, type RenderRouterOptions } from 'expo-router/testing-library';

/** Renders the app's real route tree (`app/`) starting at `initialUrl`. */
export function renderApp(initialUrl: string, options?: RenderRouterOptions) {
  return renderRouter('./app', { initialUrl, ...options });
}

export { mockAuthState, mockAuthLoading } from './mocks/firebaseAuth';
