import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PublicOnlyGate } from '@/auth/components/PublicOnlyGate';
import { useRegisterForm } from '@/auth/hooks/useRegisterForm';
import { useAppTheme } from '@/theme';

export default function RegisterScreen() {
  const theme = useAppTheme();
  const form = useRegisterForm();

  return (
    <PublicOnlyGate>
      <View style={[styles.container, { backgroundColor: theme.canvas }]}>
        <Text style={[styles.title, { color: theme.textH }]}>Create account</Text>
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
          autoComplete="new-password"
          secureTextEntry
        />
        <TextInput
          style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
          placeholder="Confirm password"
          placeholderTextColor={theme.textSoft}
          value={form.confirmPassword}
          onChangeText={form.setConfirmPassword}
          autoCapitalize="none"
          autoComplete="new-password"
          secureTextEntry
        />
        {form.error && <Text style={[styles.error, { color: theme.danger }]}>{form.error}</Text>}
        <Pressable
          testID="register-submit"
          style={[styles.button, { backgroundColor: theme.accent, borderRadius: theme.radiusBtn }]}
          onPress={form.submit}
          disabled={form.submitting}
        >
          <Text style={[styles.buttonText, { color: theme.accentCtaText }]}>
            {form.submitting ? 'Creating account…' : 'Create account'}
          </Text>
        </Pressable>
        <Link href="/login" style={styles.link}>
          <Text style={{ color: theme.textSoft }}>Already have an account? Log in</Text>
        </Link>
      </View>
    </PublicOnlyGate>
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
  link: {
    alignSelf: 'center',
    marginTop: 8,
  },
});
