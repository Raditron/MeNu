import type { Category } from '../../meal/types/category'
import type { TagValue } from '../../meal/types/tagValue'
import { QuizOptionList } from './QuizOptionList'

interface QuizStepProps {
  stepNumber: number
  stepCount: number
  category: Category
  selections: TagValue[]
  canGoNext: boolean
  canGoBack: boolean
  onSelect: (tagValue: TagValue) => void
  onNext: () => void
  onBack: () => void
}

export function QuizStep({
  stepNumber,
  stepCount,
  category,
  selections,
  canGoNext,
  canGoBack,
  onSelect,
  onNext,
  onBack,
}: QuizStepProps) {
  return (
    <div className="quiz-step">
      <div className="quiz-progress-track">
        <div
          className="quiz-progress-fill"
          style={{ width: `${(stepNumber / stepCount) * 100}%` }}
        />
      </div>
      <p className="quiz-step-caption">
        Step {stepNumber} of {stepCount}
      </p>
      <h2 className="quiz-step-title">{category.name}</h2>
      <p className="quiz-step-hint">
        {category.selectionMode === 'single' ? 'Pick one' : 'Pick one or more'}
      </p>
      <QuizOptionList
        categoryName={category.name}
        options={category.options}
        selections={selections}
        onSelect={onSelect}
      />
      <div className="quiz-step-actions">
        <button type="button" className="secondary" onClick={onBack} disabled={!canGoBack}>
          Back
        </button>
        {category.selectionMode === 'multi' && (
          <button type="button" onClick={onNext} disabled={!canGoNext}>
            {stepNumber === stepCount ? 'See results' : 'Next'}
          </button>
        )}
      </div>
    </div>
  )
}
