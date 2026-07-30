import { useCallback, useState } from 'react'
import { useGetUserUid } from '../../auth/hooks/useGetUserUid'
import { editMeal as editMealRequest } from '../api'
import type { Meal } from '@menu/domain/types/meal'

export function useEditMeal() {
  const { uid } = useGetUserUid()
  const [submitting, setSubmitting] = useState(false)

  const editMeal = useCallback(
    (meal: Meal) => {
      if (!uid) return Promise.reject(new Error('No authenticated user'))
      setSubmitting(true)
      return editMealRequest(uid, meal).finally(() => setSubmitting(false))
    },
    [uid],
  )

  return { editMeal, submitting }
}
