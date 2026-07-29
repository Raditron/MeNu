import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/theme';
import { QuizOptionList } from '../QuizOptionList/QuizOptionList';
import type { QuizStepProps } from './interfaces/QuizStep.interface';
import { styles } from './styles/QuizStep.styles';

export function QuizStep({ stepNumber, stepCount, category, selections, onSelect, navigation }: QuizStepProps) {
  const theme = useAppTheme();
  const { canGoBack, onBack, canGoNext, onNext } = navigation;
  const progress = stepCount > 0 ? stepNumber / stepCount : 0;
  const isMultiSelect = category.selectionMode === 'multi';

  return (
    <View style={styles.step}>
      <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
        <View style={[styles.progressFill, { backgroundColor: theme.accent, width: `${progress * 100}%` }]} />
      </View>
      <Text style={[styles.caption, { color: theme.textSoft }]}>
        Step {stepNumber} of {stepCount}
      </Text>
      <Text style={[styles.title, { color: theme.textH }]}>{category.name}</Text>
      <Text style={[styles.hint, { color: theme.text }]}>
        {category.selectionMode === 'single' ? 'Pick one' : 'Pick one or more'}
      </Text>
      <QuizOptionList label={category.name} options={category.options} selections={selections} onSelect={onSelect} />
      {(canGoBack || isMultiSelect) && (
        <View style={styles.actions}>
          {canGoBack && (
            <Pressable testID="quiz-back" style={styles.actionButton} onPress={onBack}>
              <Text style={[styles.actionButtonText, { color: theme.textSoft }]}>Back</Text>
            </Pressable>
          )}
          {isMultiSelect && (
            <Pressable
              testID="quiz-next"
              disabled={!canGoNext}
              onPress={onNext}
              style={[
                styles.actionButton,
                styles.nextButton,
                { backgroundColor: theme.accent, borderRadius: theme.radiusBtn, opacity: canGoNext ? 1 : 0.5 },
              ]}
            >
              <Text style={[styles.actionButtonText, { color: theme.accentCtaText }]}>Next</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
