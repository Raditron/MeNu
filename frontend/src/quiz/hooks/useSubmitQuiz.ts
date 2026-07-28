import { useCallback, useState } from 'react'
import { useGetUserUid } from '../../auth/hooks/useGetUserUid'
import { submitQuiz as submitQuizRequest } from '../../meal/api'
import type { Meal } from '@menu/domain/types/meal'
import type { Mood } from '@menu/domain/types/mood'

export function useSubmitQuiz() {
  const { uid } = useGetUserUid()
  const [meals, setMeals] = useState<Meal[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const submitQuiz = useCallback(
    (mood: Mood) => {
      if (!uid) return Promise.reject(new Error('No authenticated user'))
      setSubmitting(true)
      setError(null)
      return submitQuizRequest(uid, mood)
        .then((result) => setMeals(result))
        .catch((err: Error) => {
          setError(err)
          throw err
        })
        .finally(() => setSubmitting(false))
    },
    [uid],
  )

  return { meals, submitting, error, submitQuiz }
}
