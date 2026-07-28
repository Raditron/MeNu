import { useMemo } from 'react'
import type { Category } from '../types/category'
import { useCatalog } from './useCatalog'

export function useCategories() {
  const { catalog, loading } = useCatalog()

  const categories = useMemo<Category[]>(
    () => [
      { name: 'Meat Type', selectionMode: 'single', options: catalog.meatTypes },
      { name: 'Side Type', selectionMode: 'single', options: catalog.sideTypes },
      { name: 'Cuisine Style', selectionMode: 'multi', options: catalog.cuisineStyles },
      { name: 'Flavor Profile', selectionMode: 'multi', options: catalog.flavorProfiles },
    ],
    [catalog],
  )

  return { categories, loading }
}
