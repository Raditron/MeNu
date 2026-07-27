import { useQuizWizard } from '../../hooks/useQuizWizard'
import { QuizResults } from '../QuizResults/QuizResults'
import { QuizStep } from '../QuizStep/QuizStep'
import styles from './styles/QuizPage.module.css'

export function QuizPage() {
  const {
    loading,
    categories,
    stepIndex,
    currentCategory,
    selections,
    canGoNext,
    mood,
    selectOption,
    goNext,
    goBack,
    restart,
  } = useQuizWizard()

  if (loading) return <p>Loading quiz…</p>

  if (mood) return <QuizResults mood={mood} onRestart={restart} />

  if (!currentCategory) return null

  return (
    <section className={styles.quizPage}>
      <QuizStep
        key={stepIndex}
        stepNumber={stepIndex + 1}
        stepCount={categories.length}
        category={currentCategory}
        selections={selections}
        canGoNext={canGoNext}
        canGoBack={stepIndex > 0}
        onSelect={selectOption}
        onNext={goNext}
        onBack={goBack}
      />
    </section>
  )
}
