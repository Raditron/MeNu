import type { Meal } from '../types/meal.ts'
import type { TagValue } from '../types/tagValue.ts'

export type MealHistoryDateRange = 'last7Days' | 'last30Days' | 'allTime'

export interface MealHistoryEntry {
  mealId: string
  mealName: string
  date: string
  meatType: TagValue
  sideType: TagValue
  cuisineStyles: TagValue[]
  flavorProfiles: TagValue[]
}

export interface MealHistoryFilters {
  nameQuery?: string
  dateRange?: MealHistoryDateRange
  meatTypes?: string[]
  sideTypes?: string[]
  cuisineStyles?: string[]
  flavorProfiles?: string[]
}

const DATE_RANGE_DAYS: Record<'last7Days' | 'last30Days', number> = {
  last7Days: 7,
  last30Days: 30,
}

function flatten(meals: Meal[]): MealHistoryEntry[] {
  return meals.flatMap((meal) =>
    meal.eatenHistory.map((entry) => ({
      mealId: meal.id,
      mealName: meal.name,
      date: entry.date,
      meatType: meal.meatType.tagValue,
      sideType: meal.sideType.tagValue,
      cuisineStyles: meal.cuisineStyles,
      flavorProfiles: meal.flavorProfiles,
    })),
  )
}

function matchesName(entry: MealHistoryEntry, nameQuery?: string): boolean {
  if (!nameQuery) return true
  return entry.mealName.toLowerCase().includes(nameQuery.toLowerCase())
}

function matchesDateRange(entry: MealHistoryEntry, dateRange: MealHistoryDateRange | undefined, now: Date): boolean {
  if (!dateRange || dateRange === 'allTime') return true
  const cutoff = new Date(now)
  cutoff.setDate(cutoff.getDate() - DATE_RANGE_DAYS[dateRange])
  return new Date(entry.date) >= cutoff
}

function matchesSingle(value: TagValue, selected?: string[]): boolean {
  if (!selected || selected.length === 0) return true
  return selected.includes(value.title)
}

function matchesMulti(values: TagValue[], selected?: string[]): boolean {
  if (!selected || selected.length === 0) return true
  const titles = new Set(values.map((value) => value.title))
  return selected.some((title) => titles.has(title))
}

export function getMealHistory(
  meals: Meal[],
  filters: MealHistoryFilters = {},
  now: Date = new Date(),
): MealHistoryEntry[] {
  return flatten(meals)
    .filter((entry) => matchesName(entry, filters.nameQuery))
    .filter((entry) => matchesDateRange(entry, filters.dateRange, now))
    .filter((entry) => matchesSingle(entry.meatType, filters.meatTypes))
    .filter((entry) => matchesSingle(entry.sideType, filters.sideTypes))
    .filter((entry) => matchesMulti(entry.cuisineStyles, filters.cuisineStyles))
    .filter((entry) => matchesMulti(entry.flavorProfiles, filters.flavorProfiles))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
