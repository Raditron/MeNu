import type { Meal } from '../meal/types/meal'
import { seedMeals } from './data/meals'

let meals: Meal[] = [...seedMeals]

export function getMeals(): Meal[] {
  return meals
}

export function saveMeal(meal: Meal): void {
  meals = [...meals, meal]
}
