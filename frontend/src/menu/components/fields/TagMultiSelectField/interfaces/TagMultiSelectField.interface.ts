import type { TagValue } from '../../../../../meal/types/tagValue'

export interface TagMultiSelectFieldProps {
  label: string
  options: TagValue[]
  selected: TagValue[]
  onToggle: (value: TagValue) => void
}
