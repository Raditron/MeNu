import type { TagValue } from '../../../../meal/types/tagValue'

export interface QuizOptionListProps {
  categoryName: string
  options: TagValue[]
  selections: TagValue[]
  onSelect: (tagValue: TagValue) => void
}
