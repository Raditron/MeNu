import { Link } from 'react-router-dom'
import { AuthCard } from '../../../shared/components/AuthCard/AuthCard'
import { TextField } from '../../../shared/components/TextField/TextField'
import { useChangePasswordForm } from '../../hooks/useChangePasswordForm'
import buttonStyles from '../../../shared/styles/button.module.css'
import formStyles from '../../../shared/styles/authForm.module.css'

export function ChangePasswordPage() {
  const form = useChangePasswordForm()

  return (
    <AuthCard title="Set a new password" subtitle="Choose a new password for your account." footer={<Link to="/login">Back to log in</Link>}>
      {form.success ? (
        <p className={formStyles.success}>Your password has been updated. You can now log in.</p>
      ) : !form.oobCode ? (
        <p className={formStyles.error}>This reset link is invalid or has expired. Request a new one from the forgot password page.</p>
      ) : (
        <form className={formStyles.form} onSubmit={form.submit}>
          <TextField
            id="new-password"
            label="New password"
            type="password"
            value={form.password}
            onChange={form.setPassword}
            autoComplete="new-password"
          />
          <TextField
            id="confirm-new-password"
            label="Confirm new password"
            type="password"
            value={form.confirmPassword}
            onChange={form.setConfirmPassword}
            autoComplete="new-password"
          />
          {form.error && <p className={formStyles.error}>{form.error}</p>}
          <button type="submit" className={buttonStyles.primary} disabled={form.submitting || !form.canSubmit}>
            {form.submitting ? 'Updating…' : 'Update password'}
          </button>
        </form>
      )}
    </AuthCard>
  )
}
