import { useCallback, useState } from 'react'
import { useGetUserUid } from '../../auth/hooks/useGetUserUid'
import { eatMeal as eatMealRequest } from '../api'

export function useEatMeal(mealId: string) {
  const { uid } = useGetUserUid()
  const [submitting, setSubmitting] = useState(false)
  const [justAte, setJustAte] = useState(false)

  const eatMeal = useCallback(() => {
    if (!uid) return Promise.reject(new Error('No authenticated user'))
    setSubmitting(true)
    setJustAte(false)
    return eatMealRequest(uid, mealId)
      .then(() => setJustAte(true))
      .finally(() => setSubmitting(false))
  }, [uid, mealId])

  return { eatMeal, submitting, justAte }
}
