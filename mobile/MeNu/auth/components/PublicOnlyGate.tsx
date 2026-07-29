import { Redirect } from 'expo-router';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { useAuth } from '../hooks/useAuth';
import { useAppTheme } from '@/theme';

/** Guards a public-only route (Login, Register): blank while resolving, redirects home once signed in. */
export function PublicOnlyGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const theme = useAppTheme();

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: theme.canvas }} />;
  }

  if (user) {
    return <Redirect href="/" />;
  }

  return <>{children}</>;
}
