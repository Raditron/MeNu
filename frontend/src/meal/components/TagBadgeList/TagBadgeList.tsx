import type { TagBadgeListProps } from './interfaces/TagBadgeList.interface'
import styles from './styles/TagBadgeList.module.css'
import { TagBadge } from '../TagBadge/TagBadge'

export function TagBadgeList({ tagValues }: TagBadgeListProps) {
  return (
    <ul className={styles.tagBadgeList}>
      {tagValues.map((tagValue) => (
        <li key={tagValue.title}>
          <TagBadge tagValue={tagValue} />
        </li>
      ))}
    </ul>
  )
}
