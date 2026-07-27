import { getTagIcon } from '../../../meal/utils/tagIcons'
import type { QuizOptionProps } from './interfaces/QuizOption.interface'
import styles from './styles/QuizOption.module.css'

export function QuizOption({ categoryName, tagValue, selected, onSelect }: QuizOptionProps) {
  const icon = getTagIcon(categoryName, tagValue.title)

  return (
    <button
      type="button"
      className={`${styles.quizOption}${selected ? ` ${styles.selected}` : ''}`}
      onClick={() => onSelect(tagValue)}
    >
      {selected && (
        <span className={styles.quizOptionCheck} aria-hidden="true">
          ✓
        </span>
      )}
      {icon && (
        <span className={styles.quizOptionIcon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.quizOptionLabel}>{tagValue.title}</span>
    </button>
  )
}
