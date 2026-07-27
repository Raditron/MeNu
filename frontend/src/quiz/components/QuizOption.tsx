import type { TagValue } from '../../meal/types/tagValue'
import { getTagIcon } from '../../meal/utils/tagIcons'

interface QuizOptionProps {
  categoryName: string
  tagValue: TagValue
  selected: boolean
  onSelect: (tagValue: TagValue) => void
}

export function QuizOption({ categoryName, tagValue, selected, onSelect }: QuizOptionProps) {
  const icon = getTagIcon(categoryName, tagValue.title)

  return (
    <button
      type="button"
      className={selected ? 'quiz-option selected' : 'quiz-option'}
      onClick={() => onSelect(tagValue)}
    >
      {selected && (
        <span className="quiz-option-check" aria-hidden="true">
          ✓
        </span>
      )}
      {icon && (
        <span className="quiz-option-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="quiz-option-label">{tagValue.title}</span>
    </button>
  )
}
