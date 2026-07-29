import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useForgotPasswordForm } from '@/auth/hooks/useForgotPasswordForm';
import { useAppTheme } from '@/theme';

export default function ForgotPasswordScreen() {
  const theme = useAppTheme();
  const form = useForgotPasswordForm();

  return (
    <View style={[styles.container, { backgroundColor: theme.canvas }]}>
      <Text style={[styles.title, { color: theme.textH }]}>Forgot password</Text>
      {form.sent ? (
        <Text style={[styles.success, { color: theme.text }]}>
          Check your inbox for a link to reset your password.
        </Text>
      ) : (
        <>
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
          {form.error && <Text style={[styles.error, { color: theme.danger }]}>{form.error}</Text>}
          <Pressable
            testID="forgot-password-submit"
            style={[styles.button, { backgroundColor: theme.accent, borderRadius: theme.radiusBtn }]}
            onPress={form.submit}
            disabled={form.submitting}
          >
            <Text style={[styles.buttonText, { color: theme.accentCtaText }]}>
              {form.submitting ? 'Sending…' : 'Send reset link'}
            </Text>
          </Pressable>
        </>
      )}
      <Link href="/login" style={styles.link}>
        <Text style={{ color: theme.textSoft }}>Back to log in</Text>
      </Link>
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
  success: {
    fontSize: 15,
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
