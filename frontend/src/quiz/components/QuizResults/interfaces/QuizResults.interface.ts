import type { Meal } from '@menu/domain/types/meal'
import type { Mood } from '@menu/domain/types/mood'

export interface QuizResultsProps {
  mood: Mood
  meals: Meal[]
  onRestart: () => void
}
