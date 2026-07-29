import { NavLink } from 'react-router-dom'
import { signOut } from '../../../auth/api'
import { useGetUserByUid } from '../../../auth/hooks/useGetUserByUid'
import styles from './styles/NavBar.module.css'

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return `${styles.navLink}${isActive ? ` ${styles.active}` : ''}`
}

export function NavBar() {
  const { user } = useGetUserByUid()

  return (
    <nav className={styles.navBar}>
      <div className={styles.header}>
        <span className={styles.navBrand}>MeNu</span>
        <p className={styles.greeting}>
          Hello, <span className={styles.greetingName}>{user?.email?.split('@')[0]}</span>
        </p>
      </div>
      <div className={styles.navLinks}>
        <NavLink to="/menu" className={navLinkClassName}>
          Menu
        </NavLink>
        <NavLink to="/quiz" className={navLinkClassName}>
          Quiz
        </NavLink>
      </div>
      <button type="button" className={styles.signOut} onClick={() => void signOut()}>
        Sign out
      </button>
    </nav>
  )
}
