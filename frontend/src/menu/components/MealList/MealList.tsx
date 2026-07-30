import { useNavigate } from 'react-router-dom'
import { MealCard } from '../../../meal/components/MealCard/MealCard'
import { EditMealModal } from '../EditMealModal/EditMealModal'
import type { MealListProps } from './interfaces/MealList.interface'
import listStyles from '../../../shared/styles/list.module.css'

export function MealList({ meals, onMealEdited }: MealListProps) {
  const navigate = useNavigate()

  return (
    <ul className={listStyles.mealList}>
      {meals.map((meal) => (
        <li key={meal.id}>
          <MealCard
            meal={meal}
            onPress={() => navigate(`/menu/${meal.id}`)}
            renderEditModal={
              onMealEdited &&
              (({ meal, onClose }) => (
                <EditMealModal meal={meal} onClose={onClose} onEdited={onMealEdited} />
              ))
            }
          />
        </li>
      ))}
    </ul>
  )
}
