import { Link } from 'react-router-dom'
import { AuthCard } from '../../../shared/components/AuthCard/AuthCard'
import { TextField } from '../../../shared/components/TextField/TextField'
import { useRegisterForm } from '../../hooks/useRegisterForm'
import buttonStyles from '../../../shared/styles/button.module.css'
import formStyles from '../../../shared/styles/authForm.module.css'

export function RegisterPage() {
  const form = useRegisterForm()

  return (
    <AuthCard
      title="Create account"
      subtitle="Let's get your menu started."
      footer={
        <>
          Already have an account? <Link to="/login">Log in</Link>
        </>
      }
    >
      <form className={formStyles.form} onSubmit={form.submit}>
        <TextField id="register-email" label="Email" type="email" value={form.email} onChange={form.setEmail} autoComplete="email" />
        <TextField
          id="register-password"
          label="Password"
          type="password"
          value={form.password}
          onChange={form.setPassword}
          autoComplete="new-password"
        />
        <TextField
          id="register-confirm-password"
          label="Confirm password"
          type="password"
          value={form.confirmPassword}
          onChange={form.setConfirmPassword}
          autoComplete="new-password"
        />
        {form.error && <p className={formStyles.error}>{form.error}</p>}
        <button type="submit" className={buttonStyles.primary} disabled={form.submitting}>
          {form.submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthCard>
  )
}
