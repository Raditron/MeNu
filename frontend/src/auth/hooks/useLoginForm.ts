import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginWithEmail } from '../api'
import { formatAuthError } from '../utils/formatAuthError'

export function useLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  function submit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    loginWithEmail(email, password)
      .then(() => navigate('/menu'))
      .catch((err) => setError(formatAuthError(err)))
      .finally(() => setSubmitting(false))
  }

  return { email, setEmail, password, setPassword, error, submitting, submit }
}
