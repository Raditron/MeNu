import type { TagValue } from '../../../../meal/types/tagValue'

export interface QuizOptionProps {
  tagValue: TagValue
  selected: boolean
  onSelect: (tagValue: TagValue) => void
}
