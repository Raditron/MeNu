import type { QuizStepProps } from "./interfaces/QuizStep.interface";
import styles from "./styles/QuizStep.module.css";
import buttonStyles from "../../../shared/styles/button.module.css";
import { QuizOptionList } from "../QuizOptionList/QuizOptionList";

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
  const isMulti = category.selectionMode === "multi";
  return (
    <div className={styles.quizStep}>
      <div className={styles.quizProgressTrack}>
        <div
          className={styles.quizProgressFill}
          style={{ width: `${(stepNumber / stepCount) * 100}%` }}
        />
      </div>
      <p className={styles.quizStepCaption}>
        Step {stepNumber} of {stepCount}
      </p>
      <h2 className={styles.quizStepTitle}>{category.name}</h2>
      <p className={styles.quizStepHint}>
        {category.selectionMode === "single" ? "Pick one" : "Pick one or more"}
      </p>
      <QuizOptionList
        options={category.options}
        selections={selections}
        onSelect={onSelect}
      />

      <div className={styles.quizStepActions}>
        <button
          type="button"
          className={buttonStyles.secondary}
          onClick={onBack}
          disabled={!canGoBack}
        >
          Back
        </button>
        
      {isMulti && (
        <button
          type="button"
          className={styles.quizStepSkip}
          onClick={() => onSelect(null)}
        >
          I don't know
        </button>
      )}
        {isMulti && (
          <button
            type="button"
            className={buttonStyles.primary}
            onClick={onNext}
            disabled={!canGoNext}
          >
            {stepNumber === stepCount ? "See results" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}
