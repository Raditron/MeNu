import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { signOutUser } from '@/auth/api';
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
    <View style={{ flex: 1, backgroundColor: theme.canvas }}>
      <View style={[styles.chrome, { backgroundColor: theme.surface, borderBottomColor: theme.borderSubtle }]}>
        <Text style={[styles.email, { color: theme.text }]}>{user.email}</Text>
        <Pressable testID="sign-out" onPress={() => void signOutUser()}>
          <Text style={[styles.signOut, { color: theme.accent }]}>Sign out</Text>
        </Pressable>
      </View>
      <Tabs screenOptions={{ tabBarActiveTintColor: theme.accent }}>
        <Tabs.Screen name="index" options={{ title: 'Menu' }} />
        <Tabs.Screen name="quiz" options={{ title: 'Quiz' }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  chrome: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  email: {
    fontSize: 14,
  },
  signOut: {
    fontSize: 14,
    fontWeight: '600',
  },
});
