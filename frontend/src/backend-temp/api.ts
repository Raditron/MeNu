import type { Category } from '../meal/types/category'
import type { Meal } from '../meal/types/meal'
import { categories } from './data/tagValues'
import { getMeals, saveMeal } from './store'

export type NewMeal = Omit<Meal, 'id'>

export function listMeals(): Promise<Meal[]> {
  return Promise.resolve(getMeals())
}

export function listCategories(): Promise<Category[]> {
  return Promise.resolve(categories)
}

export function addMeal(newMeal: NewMeal): Promise<Meal> {
  const meal: Meal = { ...newMeal, id: crypto.randomUUID() }
  saveMeal(meal)
  return Promise.resolve(meal)
}
