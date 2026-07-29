import { useState } from 'react';
import { registerWithEmail } from '../api';
import { formatAuthError } from '../utils/formatAuthError';

export function useRegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function submit() {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    setSubmitting(true);
    registerWithEmail(email, password)
      .catch((err) => setError(formatAuthError(err)))
      .finally(() => setSubmitting(false));
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    submitting,
    submit,
  };
}
