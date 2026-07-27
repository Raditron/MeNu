import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerWithEmail } from '../api'
import { formatAuthError } from '../utils/formatAuthError'

export function useRegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  function submit(event: FormEvent) {
    event.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setError(null)
    setSubmitting(true)
    registerWithEmail(email, password)
      .then(() => navigate('/menu'))
      .catch((err) => setError(formatAuthError(err)))
      .finally(() => setSubmitting(false))
  }

  return { email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, error, submitting, submit }
}
