import { MealCard } from '../../meal/components/MealCard'
import type { Meal } from '../../meal/types/meal'

interface MealListProps {
  meals: Meal[]
}

export function MealList({ meals }: MealListProps) {
  return (
    <ul className="meal-list">
      {meals.map((meal) => (
        <li key={meal.id}>
          <MealCard meal={meal} />
        </li>
      ))}
    </ul>
  )
}
