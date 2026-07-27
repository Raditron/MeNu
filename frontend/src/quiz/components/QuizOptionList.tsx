import type { TagValue } from '../../meal/types/tagValue'
import { QuizOption } from './QuizOption'

interface QuizOptionListProps {
  options: TagValue[]
  selections: TagValue[]
  onSelect: (tagValue: TagValue) => void
}

export function QuizOptionList({ options, selections, onSelect }: QuizOptionListProps) {
  const selectedTitles = new Set(selections.map((value) => value.title))

  return (
    <div className="quiz-option-list">
      {options.map((option) => (
        <QuizOption
          key={option.title}
          tagValue={option}
          selected={selectedTitles.has(option.title)}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
