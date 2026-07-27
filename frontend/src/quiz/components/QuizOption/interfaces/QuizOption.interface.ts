import type { TagValue } from '../../../../meal/types/tagValue'

export interface QuizOptionProps {
  categoryName: string
  tagValue: TagValue
  selected: boolean
  onSelect: (tagValue: TagValue) => void
}
