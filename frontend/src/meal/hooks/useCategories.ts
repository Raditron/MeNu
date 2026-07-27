import { useEffect, useState } from 'react'
import { listCategories } from '../../backend-temp/api'
import type { Category } from '../types/category'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listCategories().then((result) => {
      setCategories(result)
      setLoading(false)
    })
  }, [])

  return { categories, loading }
}
