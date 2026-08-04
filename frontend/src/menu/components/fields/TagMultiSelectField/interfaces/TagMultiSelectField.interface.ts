import type { TagValue } from '@menu/domain/types/tagValue'

export interface TagMultiSelectFieldProps {
  label: string
  options: TagValue[]
  selected: TagValue[]
  onToggle: (value: TagValue) => void
  collapsible?: boolean
  defaultCollapsed?: boolean
}
