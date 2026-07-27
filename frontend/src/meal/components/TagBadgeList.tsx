import type { TagValue } from '../types/tagValue'
import { TagBadge } from './TagBadge'

interface TagBadgeListProps {
  tagValues: TagValue[]
}

export function TagBadgeList({ tagValues }: TagBadgeListProps) {
  return (
    <ul className="tag-badge-list">
      {tagValues.map((tagValue) => (
        <li key={tagValue.title}>
          <TagBadge tagValue={tagValue} />
        </li>
      ))}
    </ul>
  )
}
