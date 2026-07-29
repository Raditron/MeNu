import { fireEvent, renderHook, waitFor } from '@testing-library/react-native';
import { screen } from 'expo-router/testing-library';
import { signInWithEmailAndPassword } from 'firebase/auth';
import type { User } from 'firebase/auth';

import { renderApp } from '../test/renderApp';
import { mockAuthState } from '../test/mocks/firebaseAuth';
import { useAuth } from '../auth/hooks/useAuth';
import { SessionProvider } from '../auth/session/SessionProvider';

const mockedSignIn = signInWithEmailAndPassword as jest.Mock;

async function fillAndSubmit(email: string, password: string) {
  await fireEvent.changeText(screen.getByPlaceholderText('Email'), email);
  await fireEvent.changeText(screen.getByPlaceholderText('Password'), password);
  await fireEvent.press(screen.getByTestId('login-submit'));
}

describe('login route', () => {
  it("reflects the signed-in user in useAuth()'s session once login succeeds", async () => {
    const testUser = { uid: 'abc123', email: 'test@example.com' } as User;
    // Mirrors real Firebase: a successful sign-in fires onAuthStateChanged.
    mockedSignIn.mockImplementationOnce(() => {
      mockAuthState(testUser);
      return Promise.resolve({ user: testUser });
    });

    await renderApp('/login');

    await fillAndSubmit('test@example.com', 'correct-password');

    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'correct-password');
    });

    // Mounted after the interaction so the shared mock's `onAuthStateChanged`
    // replays its already-resolved state to this fresh subscriber.
    const { result } = await renderHook(() => useAuth(), {
      wrapper: ({ children }) => <SessionProvider>{children}</SessionProvider>,
    });
    expect(result.current).toEqual({ user: testUser, loading: false });
  });

  it('shows a clear error message when credentials are invalid', async () => {
    mockedSignIn.mockRejectedValueOnce({ code: 'auth/invalid-credential' });

    await renderApp('/login');

    await fillAndSubmit('test@example.com', 'wrong-password');

    expect(await screen.findByText('Incorrect email or password.')).toBeOnTheScreen();
  });
});
