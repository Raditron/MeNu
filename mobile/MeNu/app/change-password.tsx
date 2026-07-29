import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useChangePasswordForm } from '@/auth/hooks/useChangePasswordForm';
import { useAppTheme } from '@/theme';

export default function ChangePasswordScreen() {
  const theme = useAppTheme();
  const form = useChangePasswordForm();

  return (
    <View style={[styles.container, { backgroundColor: theme.canvas }]}>
      <Text style={[styles.title, { color: theme.textH }]}>Set a new password</Text>
      {form.success ? (
        <Text style={[styles.success, { color: theme.text }]}>
          Your password has been updated. You can now log in.
        </Text>
      ) : !form.oobCode ? (
        <Text style={[styles.error, { color: theme.danger }]}>
          This reset link is invalid or has expired. Request a new one below.
        </Text>
      ) : (
        <>
          <TextInput
            style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
            placeholder="New password"
            placeholderTextColor={theme.textSoft}
            value={form.password}
            onChangeText={form.setPassword}
            autoCapitalize="none"
            autoComplete="new-password"
            secureTextEntry
          />
          <TextInput
            style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
            placeholder="Confirm new password"
            placeholderTextColor={theme.textSoft}
            value={form.confirmPassword}
            onChangeText={form.setConfirmPassword}
            autoCapitalize="none"
            autoComplete="new-password"
            secureTextEntry
          />
          {form.error && <Text style={[styles.error, { color: theme.danger }]}>{form.error}</Text>}
          <Pressable
            testID="change-password-submit"
            style={[styles.button, { backgroundColor: theme.accent, borderRadius: theme.radiusBtn }]}
            onPress={form.submit}
            disabled={form.submitting || !form.canSubmit}
          >
            <Text style={[styles.buttonText, { color: theme.accentCtaText }]}>
              {form.submitting ? 'Updating…' : 'Update password'}
            </Text>
          </Pressable>
        </>
      )}
      {!form.success && (
        <Link href="/forgot-password" style={styles.link}>
          <Text style={{ color: theme.textSoft }}>Request a new link</Text>
        </Link>
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
