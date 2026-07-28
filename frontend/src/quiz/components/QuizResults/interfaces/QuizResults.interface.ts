import type { Meal } from '../../../../meal/types/meal'
import type { Mood } from '../../../../meal/types/mood'

export interface QuizResultsProps {
  mood: Mood
  meals: Meal[]
  onRestart: () => void
}
