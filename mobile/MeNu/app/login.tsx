import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useLoginForm } from '@/auth/hooks/useLoginForm';
import { useAppTheme } from '@/theme';

export default function LoginScreen() {
  const theme = useAppTheme();
  const form = useLoginForm();

  return (
    <View style={[styles.container, { backgroundColor: theme.canvas }]}>
      <Text style={[styles.title, { color: theme.textH }]}>Log in</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
        placeholder="Email"
        placeholderTextColor={theme.textSoft}
        value={form.email}
        onChangeText={form.setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
        placeholder="Password"
        placeholderTextColor={theme.textSoft}
        value={form.password}
        onChangeText={form.setPassword}
        autoCapitalize="none"
        autoComplete="current-password"
        secureTextEntry
      />
      {form.error && <Text style={[styles.error, { color: theme.danger }]}>{form.error}</Text>}
      <Pressable
        testID="login-submit"
        style={[styles.button, { backgroundColor: theme.accent, borderRadius: theme.radiusBtn }]}
        onPress={form.submit}
        disabled={form.submitting}
      >
        <Text style={[styles.buttonText, { color: theme.accentCtaText }]}>
          {form.submitting ? 'Logging in…' : 'Log in'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  error: {
    fontSize: 14,
  },
  button: {
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
