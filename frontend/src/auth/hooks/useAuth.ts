import { useContext } from 'react'
import { SessionContext } from '../session/SessionContext'

export function useAuth() {
  const session = useContext(SessionContext)

  if (!session) {
    throw new Error('useAuth must be used within a SessionProvider')
  }

  return session
}