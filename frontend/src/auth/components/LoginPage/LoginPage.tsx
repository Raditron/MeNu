import { Link } from 'react-router-dom'
import { AuthCard } from '../../../shared/components/AuthCard/AuthCard'
import { TextField } from '../../../shared/components/TextField/TextField'
import { useLoginForm } from '../../hooks/useLoginForm'
import buttonStyles from '../../../shared/styles/button.module.css'
import formStyles from '../../../shared/styles/authForm.module.css'

export function LoginPage() {
  const form = useLoginForm()

  return (
    <AuthCard
      title="Log in"
      subtitle="Welcome back."
      footer={
        <>
          Don't have an account? <Link to="/register">Register</Link>
        </>
      }
    >
      <form className={formStyles.form} onSubmit={form.submit}>
        <TextField id="login-email" label="Email" type="email" value={form.email} onChange={form.setEmail} autoComplete="email" />
        <TextField
          id="login-password"
          label="Password"
          type="password"
          value={form.password}
          onChange={form.setPassword}
          autoComplete="current-password"
        />
        <Link to="/forgot-password" className={formStyles.inlineLink}>
          Forgot password?
        </Link>
        {form.error && <p className={formStyles.error}>{form.error}</p>}
        <button type="submit" className={buttonStyles.primary} disabled={form.submitting}>
          {form.submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </AuthCard>
  )
}
