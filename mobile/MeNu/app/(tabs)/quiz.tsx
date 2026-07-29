import { ScrollView, StyleSheet, Text } from 'react-native';

import { QuizStep } from '@/quiz/components/QuizStep/QuizStep';
import { useQuizWizard } from '@/quiz/hooks/useQuizWizard';
import { useAppTheme } from '@/theme';

export default function QuizScreen() {
  const theme = useAppTheme();
  const { loading, categories, stepIndex, currentCategory, selections, selectOption, canGoBack, canGoNext, goBack, goNext } =
    useQuizWizard();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.canvas }} contentContainerStyle={styles.content}>
      {loading ? (
        <Text style={{ color: theme.text }}>Loading quiz…</Text>
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
