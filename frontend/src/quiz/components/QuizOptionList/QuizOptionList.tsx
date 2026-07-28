import { useState, type CSSProperties } from 'react'
import type { QuizOptionListProps } from './interfaces/QuizOptionList.interface'
import styles from './styles/QuizOptionList.module.css'
import { QuizOption } from '../QuizOption/QuizOption'

const COLLAPSED_OPTION_COUNT = 4

export function QuizOptionList({ options, selections, onSelect }: QuizOptionListProps) {
  const [showAll, setShowAll] = useState(false)
  const selectedTitles = new Set(selections.map((value) => value.title))
  const visibleOptions = showAll ? options : options.slice(0, COLLAPSED_OPTION_COUNT)
  const gridSize = Math.ceil(Math.sqrt(visibleOptions.length)) || 1

  return (
    <>
      <div
        className={styles.quizOptionList}
        style={{ '--quiz-grid-size': gridSize } as CSSProperties}
      >
        {visibleOptions.map((option) => (
          <QuizOption
            key={option.title}
            tagValue={option}
            selected={selectedTitles.has(option.title)}
            onSelect={onSelect}
          />
        ))}
      </div>
      {options.length > COLLAPSED_OPTION_COUNT && (
        <button
          type="button"
          className={styles.showMoreButton}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show less' : 'Show more'}
        </button>
      )}
    </>
  )
}
