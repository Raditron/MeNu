import type { TagValue } from '../../meal/types/tagValue'
import { QuizOption } from './QuizOption'

interface QuizOptionListProps {
  categoryName: string
  options: TagValue[]
  selections: TagValue[]
  onSelect: (tagValue: TagValue) => void
}

export function QuizOptionList({ categoryName, options, selections, onSelect }: QuizOptionListProps) {
  const selectedTitles = new Set(selections.map((value) => value.title))

  return (
    <div className="quiz-option-list">
      {options.map((option) => (
        <QuizOption
          key={option.title}
          categoryName={categoryName}
          tagValue={option}
          selected={selectedTitles.has(option.title)}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
