import { NavLink } from 'react-router-dom'

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return isActive ? 'nav-link active' : 'nav-link'
}

export function NavBar() {
  return (
    <nav className="nav-bar">
      <span className="nav-brand">MeNu</span>
      <div className="nav-links">
        <NavLink to="/menu" className={navLinkClassName}>
          Menu
        </NavLink>
        <NavLink to="/quiz" className={navLinkClassName}>
          Quiz
        </NavLink>
      </div>
    </nav>
  )
}
