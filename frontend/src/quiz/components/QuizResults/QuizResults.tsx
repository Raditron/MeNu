import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MealCard } from '../../../meal/components/MealCard/MealCard'
import { calculateMatchScore } from '@menu/domain/utils/calculateMatchScore'
import type { QuizResultsProps } from './interfaces/QuizResults.interface'
import styles from './styles/QuizResults.module.css'
import listStyles from '../../../shared/styles/list.module.css'
import buttonStyles from '../../../shared/styles/button.module.css'

export function QuizResults({ mood, meals, onRestart }: QuizResultsProps) {
  const navigate = useNavigate()
  const rankedMeals = useMemo(
    () =>
      meals
        .map((meal) => ({ meal, matchScore: calculateMatchScore(meal, mood) }))
        .sort((a, b) => b.matchScore - a.matchScore),
    [meals, mood],
  )

  return (
    <section className={styles.quizResults}>
      <div className={styles.quizResultsHeader}>
        <h2>Your matches</h2>
        <button type="button" className={buttonStyles.secondary} onClick={onRestart}>
          Retake quiz
        </button>
      </div>
      <ul className={listStyles.mealList}>
        {rankedMeals.map(({ meal, matchScore }) => (
          <li key={meal.id}>
            <MealCard meal={meal} matchScore={matchScore} onPress={() => navigate(`/menu/${meal.id}`)} />
          </li>
        ))}
      </ul>
    </section>
  )
}
