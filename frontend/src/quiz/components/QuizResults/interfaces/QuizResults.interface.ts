import type { Mood } from '../../../../meal/types/mood'

export interface QuizResultsProps {
  mood: Mood
  onRestart: () => void
}
