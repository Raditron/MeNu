import type { TagValue } from '../types/tagValue'

interface TagBadgeProps {
  tagValue: TagValue
}

export function TagBadge({ tagValue }: TagBadgeProps) {
  return <span className="tag-badge">{tagValue.title}</span>
}
