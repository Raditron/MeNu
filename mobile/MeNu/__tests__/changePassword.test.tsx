import { fireEvent, waitFor } from '@testing-library/react-native';
import { screen } from 'expo-router/testing-library';
import { confirmPasswordReset } from 'firebase/auth';
import type { User } from 'firebase/auth';

import { renderApp } from '../test/renderApp';
import { mockAuthState } from '../test/mocks/firebaseAuth';

const mockedConfirmPasswordReset = confirmPasswordReset as jest.Mock;

async function fillAndSubmit(password: string, confirmPassword: string) {
  await fireEvent.changeText(screen.getByPlaceholderText('New password'), password);
  await fireEvent.changeText(screen.getByPlaceholderText('Confirm new password'), confirmPassword);
  await fireEvent.press(screen.getByTestId('change-password-submit'));
}

describe('change-password route', () => {
  it('opens directly to the change-password form when a valid oobCode arrives via deep link', async () => {
    await renderApp('/change-password?oobCode=valid-code-123');

    expect(await screen.findByPlaceholderText('New password')).toBeOnTheScreen();
  });

  it('updates the password and confirms success when the oobCode is valid', async () => {
    mockedConfirmPasswordReset.mockResolvedValueOnce(undefined);

    await renderApp('/change-password?oobCode=valid-code-123');

    await fillAndSubmit('new-password', 'new-password');

    await waitFor(() => {
      expect(mockedConfirmPasswordReset).toHaveBeenCalledWith(expect.anything(), 'valid-code-123', 'new-password');
    });
    expect(await screen.findByText('Your password has been updated. You can now log in.')).toBeOnTheScreen();
  });

  it('shows a clear error and a way to request a new link when the oobCode is missing/invalid', async () => {
    await renderApp('/change-password');

    expect(
      await screen.findByText('This reset link is invalid or has expired. Request a new one below.'),
    ).toBeOnTheScreen();
    expect(screen.getByText('Request a new link')).toBeOnTheScreen();
  });

  it('shows a clear error message when the oobCode has expired', async () => {
    mockedConfirmPasswordReset.mockRejectedValueOnce({ code: 'auth/expired-action-code' });

    await renderApp('/change-password?oobCode=expired-code');

    await fillAndSubmit('new-password', 'new-password');

    expect(await screen.findByText('This reset link has expired. Request a new one.')).toBeOnTheScreen();
  });

  it('does not redirect an already-authenticated user away', async () => {
    const testUser = { uid: 'abc123', email: 'test@example.com' } as User;
    mockAuthState(testUser);

    await renderApp('/change-password?oobCode=valid-code-123');

    expect(await screen.findByPlaceholderText('New password')).toBeOnTheScreen();
  });
});
