import { NavLink } from 'react-router-dom'
import { signOut } from '../../../auth/api'
import styles from './styles/NavBar.module.css'

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return `${styles.navLink}${isActive ? ` ${styles.active}` : ''}`
}

export function NavBar() {
  return (
    <nav className={styles.navBar}>
      <span className={styles.navBrand}>MeNu</span>
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
