import { screen, waitFor } from 'expo-router/testing-library';
import type { User } from 'firebase/auth';

import { renderApp } from '../test/renderApp';
import { mockAuthLoading, mockAuthState } from '../test/mocks/firebaseAuth';

const fakeUser = { uid: 'test-uid', email: 'user@example.com' } as User;

describe('protected tab shell', () => {
  it('redirects an unauthenticated visitor to the login screen', async () => {
    mockAuthState(null);
    await renderApp('/');

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email')).toBeOnTheScreen();
    });
  });

  it('shows the shell with its tabs for a signed-in user', async () => {
    mockAuthState(fakeUser);
    await renderApp('/');

    expect(screen.getAllByText('Menu').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Quiz').length).toBeGreaterThan(0);
  });

  it('renders a neutral blank state while the session is resolving', async () => {
    mockAuthLoading();
    await renderApp('/');

    expect(screen.queryByPlaceholderText('Email')).toBeNull();
    expect(screen.queryAllByText('Menu')).toHaveLength(0);
    expect(screen.queryAllByText('Quiz')).toHaveLength(0);
  });
});
