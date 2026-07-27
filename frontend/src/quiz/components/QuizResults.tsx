import { useMemo } from 'react'
import { MealCard } from '../../meal/components/MealCard'
import { useMeals } from '../../meal/hooks/useMeals'
import type { Mood } from '../../meal/types/mood'
import { calculateMatchScore } from '../../meal/utils/calculateMatchScore'

interface QuizResultsProps {
  mood: Mood
  onRestart: () => void
}

export function QuizResults({ mood, onRestart }: QuizResultsProps) {
  const { meals, loading } = useMeals()

  const rankedMeals = useMemo(
    () =>
      meals
        .map((meal) => ({ meal, matchScore: calculateMatchScore(meal, mood) }))
        .sort((a, b) => b.matchScore - a.matchScore),
    [meals, mood],
  )

  return (
    <section className="quiz-results">
      <div className="quiz-results-header">
        <h2>Your matches</h2>
        <button type="button" className="secondary" onClick={onRestart}>
          Retake quiz
        </button>
      </div>
      {loading ? (
        <p>Loading meals…</p>
      ) : (
        <ul className="meal-list">
          {rankedMeals.map(({ meal, matchScore }) => (
            <li key={meal.id}>
              <MealCard meal={meal} matchScore={matchScore} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
