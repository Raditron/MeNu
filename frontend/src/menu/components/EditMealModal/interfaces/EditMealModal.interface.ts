import type { Meal } from '@menu/domain/types/meal'

export interface EditMealModalProps {
  meal: Meal
  onClose: () => void
  onEdited: () => void
}
