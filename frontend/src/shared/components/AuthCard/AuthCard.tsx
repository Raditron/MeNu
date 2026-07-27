import type { AuthCardProps } from './interfaces/AuthCard.interface'
import styles from './styles/AuthCard.module.css'

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div>
          <h1 className={styles.authTitle}>{title}</h1>
          {subtitle && <p className={styles.authSubtitle}>{subtitle}</p>}
        </div>
        {children}
        {footer && <p className={styles.authFooter}>{footer}</p>}
      </div>
    </div>
  )
}
