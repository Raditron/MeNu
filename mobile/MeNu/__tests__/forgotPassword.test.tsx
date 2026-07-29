import { fireEvent, waitFor } from '@testing-library/react-native';
import { screen } from 'expo-router/testing-library';
import { sendPasswordResetEmail } from 'firebase/auth';
import type { User } from 'firebase/auth';

import { renderApp } from '../test/renderApp';
import { mockAuthState } from '../test/mocks/firebaseAuth';

const mockedSendPasswordResetEmail = sendPasswordResetEmail as jest.Mock;

async function fillAndSubmit(email: string) {
  await fireEvent.changeText(screen.getByPlaceholderText('Email'), email);
  await fireEvent.press(screen.getByTestId('forgot-password-submit'));
}

describe('forgot-password route', () => {
  it('shows a confirmation once the reset email request succeeds', async () => {
    mockedSendPasswordResetEmail.mockResolvedValueOnce(undefined);

    await renderApp('/forgot-password');

    await fillAndSubmit('test@example.com');

    await waitFor(() => {
      expect(mockedSendPasswordResetEmail).toHaveBeenCalledWith(
        expect.anything(),
        'test@example.com',
        expect.objectContaining({ handleCodeInApp: true }),
      );
    });
    expect(await screen.findByText('Check your inbox for a link to reset your password.')).toBeOnTheScreen();
  });

  it('shows a clear error message when the request fails', async () => {
    mockedSendPasswordResetEmail.mockRejectedValueOnce({ code: 'auth/user-not-found' });

    await renderApp('/forgot-password');

    await fillAndSubmit('nobody@example.com');

    expect(await screen.findByText('No account found with that email.')).toBeOnTheScreen();
  });

  it('does not redirect an already-authenticated user away', async () => {
    const testUser = { uid: 'abc123', email: 'test@example.com' } as User;
    mockAuthState(testUser);

    await renderApp('/forgot-password');

    expect(await screen.findByPlaceholderText('Email')).toBeOnTheScreen();
    expect(screen.queryAllByText('Menu')).toHaveLength(0);
  });
});
