import type { TagValue } from '../../../../meal/types/tagValue'

export interface QuizOptionListProps {
  options: TagValue[]
  selections: TagValue[]
  onSelect: (tagValue: TagValue) => void
}
