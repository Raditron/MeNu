import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { MenuPage } from './menu/components/MenuPage'
import { QuizPage } from './quiz/components/QuizPage'
import { NavBar } from './shared/components/NavBar'

function App() {
  return (
    <>
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/" element={<Navigate to="/menu" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default App
