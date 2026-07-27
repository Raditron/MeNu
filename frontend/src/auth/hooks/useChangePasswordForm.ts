import { useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { confirmPasswordReset } from '../api'
import { formatAuthError } from '../utils/formatAuthError'

export function useChangePasswordForm() {
  const [searchParams] = useSearchParams()
  const oobCode = searchParams.get('oobCode')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const canSubmit = password.length >= 6 && password === confirmPassword

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!oobCode) return
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setError(null)
    setSubmitting(true)
    confirmPasswordReset(oobCode, password)
      .then(() => setSuccess(true))
      .catch((err) => setError(formatAuthError(err)))
      .finally(() => setSubmitting(false))
  }

  return {
    oobCode,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    submitting,
    success,
    canSubmit,
    submit,
  }
}
