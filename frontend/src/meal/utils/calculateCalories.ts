import type { Meal } from '../types/meal'

export function calculateCalories(meal: Pick<Meal, 'meatType' | 'sideType'>): number {
  return (
    meal.meatType.grams * meal.meatType.tagValue.caloriesPerGram +
    meal.sideType.grams * meal.sideType.tagValue.caloriesPerGram
  )
}
