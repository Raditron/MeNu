import { Text } from 'react-native';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type Auth } from 'firebase/auth';
import { renderRouter, screen, waitFor } from 'expo-router/testing-library';
import { mockAuthState } from '../test/mocks/firebaseAuth';

function FetchAndAuthProbe() {
  const [email, setEmail] = useState('loading');
  const [catalogSize, setCatalogSize] = useState<number | null>(null);

  useEffect(() => {
    return onAuthStateChanged({} as Auth, (user) => setEmail(user?.email ?? 'signed-out'));
  }, []);

  useEffect(() => {
    fetch('/api/catalog')
      .then((res) => res.json())
      .then((data) => setCatalogSize(data.length));
  }, []);

  return (
    <Text>
      {email} / {catalogSize === null ? 'fetching' : `${catalogSize} items`}
    </Text>
  );
}

describe('mobile test infrastructure smoke test', () => {
  it('mounts the route tree and reflects both the fetch and firebase/auth mocks', async () => {
    mockAuthState({ email: 'user@example.com' } as never);

    const router = renderRouter({ index: FetchAndAuthProbe }, { initialUrl: '/' });

    expect(router.getPathname()).toBe('/');

    await waitFor(() => {
      expect(screen.getByText('user@example.com / 0 items')).toBeOnTheScreen();
    });
  });
});
