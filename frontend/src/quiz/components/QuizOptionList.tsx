import type { CSSProperties } from 'react'
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
  const gridSize = Math.ceil(Math.sqrt(options.length)) || 1

  return (
    <div
      className="quiz-option-list"
      style={{ '--quiz-grid-size': gridSize } as CSSProperties}
    >
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
