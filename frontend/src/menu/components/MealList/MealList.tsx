import { MealCard } from '../../../meal/components/MealCard/MealCard'
import type { MealListProps } from './interfaces/MealList.interface'
import listStyles from '../../../shared/styles/list.module.css'

export function MealList({ meals }: MealListProps) {
  return (
    <ul className={listStyles.mealList}>
      {meals.map((meal) => (
        <li key={meal.id}>
          <MealCard meal={meal} />
        </li>
      ))}
    </ul>
  )
}
