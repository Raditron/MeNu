import { fireEvent, renderHook, waitFor } from '@testing-library/react-native';
import { screen } from 'expo-router/testing-library';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import type { User } from 'firebase/auth';

import { renderApp } from '../test/renderApp';
import { mockAuthState } from '../test/mocks/firebaseAuth';
import { useAuth } from '../auth/hooks/useAuth';
import { SessionProvider } from '../auth/session/SessionProvider';

const mockedCreateUser = createUserWithEmailAndPassword as jest.Mock;

async function fillAndSubmit(email: string, password: string, confirmPassword: string) {
  await fireEvent.changeText(screen.getByPlaceholderText('Email'), email);
  await fireEvent.changeText(screen.getByPlaceholderText('Password'), password);
  await fireEvent.changeText(screen.getByPlaceholderText('Confirm password'), confirmPassword);
  await fireEvent.press(screen.getByTestId('register-submit'));
}

describe('register route', () => {
  it("reflects the newly-created user in useAuth()'s session once registration succeeds", async () => {
    const testUser = { uid: 'new-user-1', email: 'newuser@example.com' } as User;
    // Mirrors real Firebase: a successful account creation fires onAuthStateChanged.
    mockedCreateUser.mockImplementationOnce(() => {
      mockAuthState(testUser);
      return Promise.resolve({ user: testUser });
    });

    await renderApp('/register');

    await fillAndSubmit('newuser@example.com', 'correct-password', 'correct-password');

    await waitFor(() => {
      expect(mockedCreateUser).toHaveBeenCalledWith(expect.anything(), 'newuser@example.com', 'correct-password');
    });

    // Mounted after the interaction so the shared mock's `onAuthStateChanged`
    // replays its already-resolved state to this fresh subscriber.
    const { result } = await renderHook(() => useAuth(), {
      wrapper: ({ children }) => <SessionProvider>{children}</SessionProvider>,
    });
    expect(result.current).toEqual({ user: testUser, loading: false });
  });

  it('shows a clear validation error when password and confirmation do not match, without calling firebase', async () => {
    mockedCreateUser.mockClear();

    await renderApp('/register');

    await fillAndSubmit('newuser@example.com', 'correct-password', 'different-password');

    expect(await screen.findByText('Passwords do not match.')).toBeOnTheScreen();
    expect(mockedCreateUser).not.toHaveBeenCalled();
  });

  it('shows a clear error message when the email is already in use', async () => {
    mockedCreateUser.mockRejectedValueOnce({ code: 'auth/email-already-in-use' });

    await renderApp('/register');

    await fillAndSubmit('taken@example.com', 'correct-password', 'correct-password');

    expect(await screen.findByText('An account with that email already exists.')).toBeOnTheScreen();
  });
});
