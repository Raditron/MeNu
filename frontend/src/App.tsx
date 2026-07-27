import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import styles from './App.module.css'
import { ChangePasswordPage } from './auth/components/ChangePasswordPage/ChangePasswordPage'
import { ForgotPasswordPage } from './auth/components/ForgotPasswordPage/ForgotPasswordPage'
import { LoginPage } from './auth/components/LoginPage/LoginPage'
import { ProtectedRoute } from './auth/components/ProtectedRoute/ProtectedRoute'
import { PublicOnlyRoute } from './auth/components/PublicOnlyRoute/PublicOnlyRoute'
import { RegisterPage } from './auth/components/RegisterPage/RegisterPage'
import { SessionProvider } from './auth/session/SessionProvider'
import { MenuPage } from './menu/components/MenuPage/MenuPage'
import { QuizPage } from './quiz/components/QuizPage/QuizPage'
import { NavBar } from './shared/components/NavBar/NavBar'

function AppLayout() {
  return (
    <>
      <NavBar />
      <main className={styles.appMain}>
        <Outlet />
      </main>
    </>
  )
}

function App() {
  return (
    <SessionProvider>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/" element={<Navigate to="/menu" replace />} />
          </Route>
        </Route>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
      </Routes>
    </SessionProvider>
  )
}

export default App
