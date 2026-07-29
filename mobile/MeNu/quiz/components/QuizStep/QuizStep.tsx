import { Text, View } from 'react-native';

import { useAppTheme } from '@/theme';
import { QuizOptionList } from '../QuizOptionList/QuizOptionList';
import type { QuizStepProps } from './interfaces/QuizStep.interface';
import { styles } from './styles/QuizStep.styles';

export function QuizStep({ stepNumber, stepCount, category, selections, onSelect }: QuizStepProps) {
  const theme = useAppTheme();
  const progress = stepCount > 0 ? stepNumber / stepCount : 0;

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
    </View>
  );
}
