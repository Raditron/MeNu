import type { Catalog } from '@menu/domain/types/catalog'
import type { Meal, Portion } from '@menu/domain/types/meal'
import type { Mood } from '@menu/domain/types/mood'
import type { IngredientTagValue, TagValue } from '@menu/domain/types/tagValue'

export type NewMeal = Omit<Meal, 'id'>

interface BackendPortion {
  ingredient: IngredientTagValue
  grams: number
}

interface NewBackendPortion {
  ingredientTitle: string
  grams: number
}

interface BackendMeal {
  id: string
  name: string
  meatType: BackendPortion
  sideType: BackendPortion
  cuisineStyles?: TagValue[]
  flavorProfiles?: TagValue[]
  numberOfPortions: number
  youtubeURL?: string
}

function toPortion(portion: BackendPortion): Portion {
  return { tagValue: portion.ingredient, grams: portion.grams }
}

function toMeal(meal: BackendMeal): Meal {
  return {
    id: meal.id,
    name: meal.name,
    meatType: toPortion(meal.meatType),
    sideType: toPortion(meal.sideType),
    cuisineStyles: meal.cuisineStyles ?? [],
    flavorProfiles: meal.flavorProfiles ?? [],
    numberOfPortions: meal.numberOfPortions,
    youtubeUrl: meal.youtubeURL,
  }
}

function toBackendPortion(portion: Portion): NewBackendPortion {
  return { ingredientTitle: portion.tagValue.title, grams: portion.grams }
}

export async function listMeals(uid: string): Promise<Meal[]> {
  const response = await fetch(`/api/users/${uid}/meals`)

  if (!response.ok) {
    const { error } = await response.json()
    throw new Error(error ?? 'Error fetching meals')
  }

  const meals: BackendMeal[] = await response.json()
  return meals.map(toMeal)
}

export async function getMealById(uid: string, mealId: string): Promise<Meal | null> {
  const response = await fetch(`/api/users/${uid}/meal/${mealId}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    const { error } = await response.json()
    throw new Error(error ?? 'Error fetching meal')
  }

  const meal: BackendMeal = await response.json()
  return toMeal(meal)
}

export async function getCatalog(): Promise<Catalog> {
  const response = await fetch('/api/catalog')

  if (!response.ok) {
    const { error } = await response.json()
    throw new Error(error ?? 'Error fetching catalog')
  }

  return response.json()
}

export async function addMeal(uid: string, meal: NewMeal): Promise<void> {
  const response = await fetch(`/api/users/${uid}/meal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      meal: {
        name: meal.name,
        meatType: toBackendPortion(meal.meatType),
        sideType: toBackendPortion(meal.sideType),
        cuisineStyles: meal.cuisineStyles,
        flavorProfiles: meal.flavorProfiles,
        youtubeURL: meal.youtubeUrl,
      },
    }),
  })

  if (!response.ok) {
    const { error } = await response.json()
    throw new Error(error ?? 'Error adding meal')
  }
}

export async function editMeal(uid: string, meal: Meal): Promise<void> {
  const response = await fetch(`/api/users/${uid}/meal`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      meal: {
        id: meal.id,
        name: meal.name,
        meatType: toBackendPortion(meal.meatType),
        sideType: toBackendPortion(meal.sideType),
        cuisineStyles: meal.cuisineStyles,
        flavorProfiles: meal.flavorProfiles,
        youtubeURL: meal.youtubeUrl,
      },
    }),
  })

  if (!response.ok) {
    const { error } = await response.json()
    throw new Error(error ?? 'Error editing meal')
  }
}

export async function submitQuiz(uid: string, mood: Mood): Promise<Meal[]> {
  const response = await fetch(`/api/users/${uid}/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mood }),
  })

  if (!response.ok) {
    const { error } = await response.json()
    throw new Error(error ?? 'Error submitting quiz')
  }

  const { meals }: { meals: BackendMeal[] } = await response.json()
  return meals.map(toMeal)
}
