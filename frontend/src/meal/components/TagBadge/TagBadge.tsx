import type { TagBadgeProps } from './interfaces/TagBadge.interface'
import styles from './styles/TagBadge.module.css'

export function TagBadge({ tagValue }: TagBadgeProps) {
  return <span className={styles.tagBadge}>{tagValue.title}</span>
}
