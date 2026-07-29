import { useState } from 'react';
import { loginWithEmail } from '../api';
import { formatAuthError } from '../utils/formatAuthError';

export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function submit() {
    setError(null);
    setSubmitting(true);
    loginWithEmail(email, password)
      .catch((err) => setError(formatAuthError(err)))
      .finally(() => setSubmitting(false));
  }

  return { email, setEmail, password, setPassword, error, submitting, submit };
}
