import type { TagValue } from '@menu/domain/types/tagValue'

export interface QuizOptionProps {
  tagValue: TagValue
  selected: boolean
  onSelect: (tagValue: TagValue) => void
}
