import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useAppTheme } from '@/theme';
import { ThemeSchemeProvider } from '@/theme/ThemeSchemeProvider';
import { useThemeScheme } from '@/theme/useThemeScheme';
import { SessionProvider } from '@/auth/session/SessionProvider';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeSchemeProvider>
      <RootLayoutNav />
    </ThemeSchemeProvider>
  );
}

function RootLayoutNav() {
  const { scheme } = useThemeScheme();
  const theme = useAppTheme();
  const baseNavigationTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseNavigationTheme,
    colors: {
      ...baseNavigationTheme.colors,
      background: theme.canvas,
      text: theme.text,
    },
  };

  return (
    <SessionProvider>
      <ThemeProvider value={navigationTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="add-meal" options={{ headerShown: false }} />
          <Stack.Screen name="edit-meal" options={{ headerShown: false }} />
          <Stack.Screen name="meal/[id]" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </SessionProvider>
  );
}
