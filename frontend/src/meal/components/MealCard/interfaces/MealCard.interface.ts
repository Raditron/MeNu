import type { ReactNode } from 'react'
import type { Meal } from '@menu/domain/types/meal'

export interface MealCardProps {
  meal: Meal
  matchScore?: number
  renderEditModal?: (props: { meal: Meal; onClose: () => void }) => ReactNode
  onPress?: () => void
}
