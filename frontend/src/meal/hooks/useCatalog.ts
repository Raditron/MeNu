import { useEffect, useState } from 'react'
import { getCatalog } from '../api'
import type { Catalog } from '../types/catalog'

const emptyCatalog: Catalog = { meatTypes: [], sideTypes: [], cuisineStyles: [], flavorProfiles: [] }

export function useCatalog() {
  const [catalog, setCatalog] = useState<Catalog>(emptyCatalog)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCatalog().then((result) => {
      setCatalog(result)
      setLoading(false)
    })
  }, [])

  return { catalog, loading }
}
