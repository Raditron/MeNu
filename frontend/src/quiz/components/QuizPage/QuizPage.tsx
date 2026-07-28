import { useEffect } from 'react'
import { useQuizWizard } from '../../hooks/useQuizWizard'
import { useSubmitQuiz } from '../../hooks/useSubmitQuiz'
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
  const { meals, submitting, error, submitQuiz } = useSubmitQuiz()

  useEffect(() => {
    if (mood) submitQuiz(mood)
  }, [mood, submitQuiz])

  if (loading) return <p>Loading quiz…</p>

  if (mood) {
    if (submitting) return <p>Finding your matches…</p>
    if (error) return <p>Something went wrong finding your matches. Please try again.</p>
    return <QuizResults mood={mood} meals={meals} onRestart={restart} />
  }

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
