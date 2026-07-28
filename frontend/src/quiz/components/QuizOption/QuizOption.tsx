import { getIngredientIcon } from '../../../meal/utils/ingredientIcons'
import type { IngredientTagValue } from '../../../meal/types/tagValue'
import type { QuizOptionProps } from './interfaces/QuizOption.interface'
import styles from './styles/QuizOption.module.css'

function isIngredientTagValue(tagValue: QuizOptionProps['tagValue']): tagValue is IngredientTagValue {
  return 'icon' in tagValue
}

export function QuizOption({ tagValue, selected, onSelect }: QuizOptionProps) {
  const Icon = isIngredientTagValue(tagValue) ? getIngredientIcon(tagValue.icon) : undefined

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
      {Icon && (
        <span className={styles.quizOptionIcon} aria-hidden="true">
          <Icon />
        </span>
      )}
      <span className={styles.quizOptionLabel}>{tagValue.title}</span>
    </button>
  )
}
