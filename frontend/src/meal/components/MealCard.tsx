import { calculateCalories } from '../utils/calculateCalories'
import type { Meal } from '../types/meal'
import { MatchBadge } from './MatchBadge'
import { TagBadgeList } from './TagBadgeList'

interface MealCardProps {
  meal: Meal
  matchScore?: number
}

export function MealCard({ meal, matchScore }: MealCardProps) {
  const calories = calculateCalories(meal)

  return (
    <article className="meal-card">
      <img className="meal-card-picture" src={meal.pictureUrl} alt="" />
      <div className="meal-card-body">
        <div className="meal-card-header">
          <h3>{meal.name}</h3>
          {matchScore !== undefined && <MatchBadge matchScore={matchScore} />}
        </div>
        <p className="meal-card-portions">
          {meal.meatType.tagValue.title} ({meal.meatType.grams}g) · {meal.sideType.tagValue.title} (
          {meal.sideType.grams}g)
        </p>
        <TagBadgeList tagValues={[...meal.cuisineStyles, ...meal.flavorProfiles]} />
        <p className="meal-card-calories">{Math.round(calories)} cal</p>
      </div>
    </article>
  )
}
