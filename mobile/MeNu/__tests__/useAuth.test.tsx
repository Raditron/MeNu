import { act, renderHook } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';

import { useAuth } from '../auth/hooks/useAuth';
import { SessionProvider } from '../auth/session/SessionProvider';
import { mockAuthLoading, mockAuthState } from '../test/mocks/firebaseAuth';

const testUser = { uid: 'abc123', email: 'test@example.com' } as User;

function wrapper({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

describe('useAuth', () => {
  it('starts in a loading state until Firebase reports back', async () => {
    mockAuthLoading();

    const { result } = await renderHook(() => useAuth(), { wrapper });

    expect(result.current).toEqual({ user: null, loading: true });
  });

  it('reflects a signed-in user once onAuthStateChanged fires', async () => {
    const { result } = await renderHook(() => useAuth(), { wrapper });

    await act(() => {
      mockAuthState(testUser);
    });

    expect(result.current).toEqual({ user: testUser, loading: false });
  });

  it('reflects sign-out after having been signed in', async () => {
    const { result } = await renderHook(() => useAuth(), { wrapper });

    await act(() => {
      mockAuthState(testUser);
    });
    await act(() => {
      mockAuthState(null);
    });

    expect(result.current).toEqual({ user: null, loading: false });
  });
});
