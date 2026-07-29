import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { View } from 'react-native';

import { useAuth } from '@/auth/hooks/useAuth';
import { useAppTheme } from '@/theme';

export default function TabLayout() {
  const { user, loading } = useAuth();
  const theme = useAppTheme();

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: theme.canvas }} />;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: theme.accent }}>
      <Tabs.Screen name="index" options={{ title: 'Menu' }} />
      <Tabs.Screen name="quiz" options={{ title: 'Quiz' }} />
    </Tabs>
  );
}
