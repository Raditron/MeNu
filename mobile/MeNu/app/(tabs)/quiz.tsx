import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { QuizResults } from '@/quiz/components/QuizResults/QuizResults';
import { QuizStep } from '@/quiz/components/QuizStep/QuizStep';
import { useQuizWizard } from '@/quiz/hooks/useQuizWizard';
import { useSubmitQuiz } from '@/quiz/hooks/useSubmitQuiz';
import { useAppTheme } from '@/theme';

export default function QuizScreen() {
  const theme = useAppTheme();
  const {
    loading,
    categories,
    stepIndex,
    currentCategory,
    selections,
    mood,
    selectOption,
    canGoBack,
    canGoNext,
    goBack,
    goNext,
    restart,
  } = useQuizWizard();
  const { meals, submitting, error, submitQuiz } = useSubmitQuiz();

  useEffect(() => {
    if (mood) submitQuiz(mood);
  }, [mood, submitQuiz]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.canvas }} contentContainerStyle={styles.content}>
      {loading ? (
        <Text style={{ color: theme.text }}>Loading quiz…</Text>
      ) : mood ? (
        submitting ? (
          <Text style={{ color: theme.text }}>Finding your matches…</Text>
        ) : error ? (
          <Text style={{ color: theme.danger }}>Something went wrong finding your matches. Please try again.</Text>
        ) : (
          <QuizResults mood={mood} meals={meals} onRestart={restart} />
        )
      ) : (
        currentCategory && (
          <QuizStep
            stepNumber={stepIndex + 1}
            stepCount={categories.length}
            category={currentCategory}
            selections={selections}
            onSelect={selectOption}
            navigation={{ canGoBack, onBack: goBack, canGoNext, onNext: goNext }}
          />
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
});
