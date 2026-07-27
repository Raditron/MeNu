import type { MatchBadgeProps } from './interfaces/MatchBadge.interface'
import styles from './styles/MatchBadge.module.css'

export function MatchBadge({ matchScore }: MatchBadgeProps) {
  const percent = Math.round(matchScore * 100)
  return <span className={styles.matchBadge}>{percent}% match</span>
}
