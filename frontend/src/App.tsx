import { useState } from 'react'
import './App.css'
import { MenuPage } from './menu/components/MenuPage'
import { QuizPage } from './quiz/components/QuizPage'
import type { AppPage } from './shared/components/NavBar'
import { NavBar } from './shared/components/NavBar'

function App() {
  const [page, setPage] = useState<AppPage>('menu')

  return (
    <>
      <NavBar activePage={page} onNavigate={setPage} />
      <main className="app-main">{page === 'menu' ? <MenuPage /> : <QuizPage />}</main>
    </>
  )
}

export default App
