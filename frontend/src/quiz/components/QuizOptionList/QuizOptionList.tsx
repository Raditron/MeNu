import type { CSSProperties } from 'react'
import type { QuizOptionListProps } from './interfaces/QuizOptionList.interface'
import styles from './styles/QuizOptionList.module.css'
import { QuizOption } from '../QuizOption/QuizOption'

export function QuizOptionList({ categoryName, options, selections, onSelect }: QuizOptionListProps) {
  const selectedTitles = new Set(selections.map((value) => value.title))
  const gridSize = Math.ceil(Math.sqrt(options.length)) || 1

  return (
    <div
      className={styles.quizOptionList}
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
