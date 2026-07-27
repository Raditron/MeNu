export type AppPage = 'menu' | 'quiz'

interface NavBarProps {
  activePage: AppPage
  onNavigate: (page: AppPage) => void
}

export function NavBar({ activePage, onNavigate }: NavBarProps) {
  return (
    <nav className="nav-bar">
      <span className="nav-brand">MeNu</span>
      <div className="nav-links">
        <button
          type="button"
          className={activePage === 'menu' ? 'nav-link active' : 'nav-link'}
          onClick={() => onNavigate('menu')}
        >
          Menu
        </button>
        <button
          type="button"
          className={activePage === 'quiz' ? 'nav-link active' : 'nav-link'}
          onClick={() => onNavigate('quiz')}
        >
          Quiz
        </button>
      </div>
    </nav>
  )
}
