import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { auth } from '../../shared/firebase/firebase'
import { SessionContext } from './SessionContext'
import type { Session } from './SessionContext'

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>({ user: null, loading: true })

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setSession({ user, loading: false })
    })
  }, [])

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
}
