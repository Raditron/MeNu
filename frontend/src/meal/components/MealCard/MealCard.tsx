import { calculateCalories } from '../../utils/calculateCalories'
import { getTagIcon } from '../../utils/tagIcons'
import type { MealCardProps } from './interfaces/MealCard.interface'
import styles from './styles/MealCard.module.css'
import { MatchBadge } from '../MatchBadge/MatchBadge'
import { TagBadgeList } from '../TagBadgeList/TagBadgeList'

export function MealCard({ meal, matchScore }: MealCardProps) {
  const calories = calculateCalories(meal)
  const icon = getTagIcon('Meat Type', meal.meatType.tagValue.title) ?? '🍽️'

  return (
    <article className={styles.mealCard}>
      <div className={styles.mealCardPicture} aria-hidden="true">
        {icon}
      </div>
      <div className={styles.mealCardBody}>
        <div className={styles.mealCardHeader}>
          <h3>{meal.name}</h3>
          {matchScore !== undefined && <MatchBadge matchScore={matchScore} />}
        </div>
        <p className={styles.mealCardPortions}>
          {meal.meatType.tagValue.title} ({meal.meatType.grams}g) · {meal.sideType.tagValue.title} (
          {meal.sideType.grams}g)
        </p>
        <TagBadgeList tagValues={[...meal.cuisineStyles, ...meal.flavorProfiles]} />
        <p className={styles.mealCardCalories}>{Math.round(calories)} cal</p>
      </div>
    </article>
  )
}
