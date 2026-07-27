import type { TagValue } from '../../meal/types/tagValue'

interface QuizOptionProps {
  tagValue: TagValue
  selected: boolean
  onSelect: (tagValue: TagValue) => void
}

export function QuizOption({ tagValue, selected, onSelect }: QuizOptionProps) {
  return (
    <button
      type="button"
      className={selected ? 'quiz-option selected' : 'quiz-option'}
      onClick={() => onSelect(tagValue)}
    >
      {tagValue.title}
    </button>
  )
}
