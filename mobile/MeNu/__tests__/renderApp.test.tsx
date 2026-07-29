import { renderApp } from '../test/renderApp';

describe('renderApp', () => {
  it('mounts the real (currently minimal) route tree', () => {
    const router = renderApp('/');

    expect(router.getPathname()).toBe('/');
  });
});
