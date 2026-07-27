import type { Category } from '../../../../meal/types/category'
import type { TagValue } from '../../../../meal/types/tagValue'

export interface QuizStepProps {
  stepNumber: number
  stepCount: number
  category: Category
  selections: TagValue[]
  canGoNext: boolean
  canGoBack: boolean
  onSelect: (tagValue: TagValue) => void
  onNext: () => void
  onBack: () => void
}
