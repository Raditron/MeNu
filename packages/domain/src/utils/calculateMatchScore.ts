import type { Meal } from '../types/meal.ts'
import type { Mood } from '../types/mood.ts'
import type { TagValue } from '../types/tagValue.ts'

function singleSelectScore(mealValue: TagValue, moodValue: TagValue): number {
  return mealValue.title === moodValue.title ? 1 : 0
}

function multiSelectScore(mealValues: TagValue[], moodValues: TagValue[] | null): number {
  if (mealValues.length === 0 || !moodValues) return 0
  const moodTitles = new Set(moodValues.map((value) => value.title))
  const matchedCount = mealValues.filter((value) => moodTitles.has(value.title)).length
  return matchedCount / mealValues.length
}

export function calculateMatchScore(meal: Meal, mood: Mood): number {
  const categoryScores = [
    singleSelectScore(meal.meatType.tagValue, mood.meatType),
    singleSelectScore(meal.sideType.tagValue, mood.sideType),
    multiSelectScore(meal.cuisineStyles, mood.cuisineStyles),
    multiSelectScore(meal.flavorProfiles, mood.flavorProfiles),
  ]
  return categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length
}
