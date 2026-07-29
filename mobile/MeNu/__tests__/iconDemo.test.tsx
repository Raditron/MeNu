import { screen } from 'expo-router/testing-library';
import { renderApp } from '../test/renderApp';

describe('icon demo route', () => {
  it('renders sample ingredient icons, including the fallback for an unknown key', async () => {
    await renderApp('/icon-demo');

    expect(screen.getByText('GiPig')).toBeOnTheScreen();
    expect(screen.getByText('GiUnknownIcon')).toBeOnTheScreen();
    expect(screen.getAllByText('🍽️').length).toBeGreaterThan(0);
  });
});
