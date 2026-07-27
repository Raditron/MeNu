import { useCallback, useEffect, useState } from 'react'
import { listMeals } from '../../backend-temp/api'
import type { Meal } from '../types/meal'

export function useMeals() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(() => {
    setLoading(true)
    return listMeals().then((result) => {
      setMeals(result)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { meals, loading, refetch }
}
