import { Link } from 'react-router-dom'
import { AuthCard } from '../../../shared/components/AuthCard/AuthCard'
import { TextField } from '../../../shared/components/TextField/TextField'
import { useForgotPasswordForm } from '../../hooks/useForgotPasswordForm'
import buttonStyles from '../../../shared/styles/button.module.css'
import formStyles from '../../../shared/styles/authForm.module.css'

export function ForgotPasswordPage() {
  const form = useForgotPasswordForm()

  return (
    <AuthCard title="Forgot password" subtitle="We'll email you a link to reset it." footer={<Link to="/login">Back to log in</Link>}>
      {form.sent ? (
        <p className={formStyles.success}>Check your inbox for a link to reset your password.</p>
      ) : (
        <form className={formStyles.form} onSubmit={form.submit}>
          <TextField id="forgot-email" label="Email" type="email" value={form.email} onChange={form.setEmail} autoComplete="email" />
          {form.error && <p className={formStyles.error}>{form.error}</p>}
          <button type="submit" className={buttonStyles.primary} disabled={form.submitting}>
            {form.submitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthCard>
  )
}
