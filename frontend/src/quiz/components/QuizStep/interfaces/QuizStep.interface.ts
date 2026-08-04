import type { Category } from '@menu/domain/types/category'
import type { TagValue } from '@menu/domain/types/tagValue'

export interface QuizStepProps {
  stepNumber: number
  stepCount: number
  category: Category
  selections: TagValue[]
  canGoNext: boolean
  canGoBack: boolean
  onSelect: (tagValue: TagValue | null) => void
  onNext: () => void
  onBack: () => void
}
