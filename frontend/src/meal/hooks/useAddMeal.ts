import { useCallback, useState } from 'react'
import { useGetUserUid } from '../../auth/hooks/useGetUserUid'
import { addMeal as addMealRequest, type NewMeal } from '../api'

export function useAddMeal() {
  const { uid } = useGetUserUid()
  const [submitting, setSubmitting] = useState(false)

  const addMeal = useCallback(
    (meal: NewMeal) => {
      if (!uid) return Promise.reject(new Error('No authenticated user'))
      setSubmitting(true)
      return addMealRequest(uid, meal).finally(() => setSubmitting(false))
    },
    [uid],
  )

  return { addMeal, submitting }
}
