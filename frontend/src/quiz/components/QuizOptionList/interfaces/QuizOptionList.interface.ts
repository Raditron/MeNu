import type { TagValue } from '@menu/domain/types/tagValue'

export interface QuizOptionListProps {
  options: TagValue[]
  selections: TagValue[]
  onSelect: (tagValue: TagValue) => void
}
