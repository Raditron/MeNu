import { useState } from 'react'
import type { FormEvent } from 'react'
import { requestPasswordReset } from '../api'
import { formatAuthError } from '../utils/formatAuthError'

export function useForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  function submit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    requestPasswordReset(email)
      .then(() => setSent(true))
      .catch((err) => setError(formatAuthError(err)))
      .finally(() => setSubmitting(false))
  }

  return { email, setEmail, error, submitting, sent, submit }
}
