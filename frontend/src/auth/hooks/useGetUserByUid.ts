import { useEffect, useState } from 'react'
import type { User } from '../types/user'
import { useGetUserUid } from './useGetUserUid'

export function useGetUserByUid() {
  const { uid } = useGetUserUid()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) {
      setUser(null)
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`/api/users/${uid}`)
      .then(async (response) => {
        if (!response.ok) {
          const { error } = await response.json()
          throw new Error(error ?? 'Error fetching user')
        }
        return response.json()
      })
      .then((result: User) => {
        setUser(result)
        setLoading(false)
      })
  }, [uid])

  return { user, loading }
}
