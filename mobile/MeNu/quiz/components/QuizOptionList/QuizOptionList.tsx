import { View } from 'react-native';

import { QuizOption } from '../QuizOption/QuizOption';
import type { QuizOptionListProps } from './interfaces/QuizOptionList.interface';
import { styles } from './styles/QuizOptionList.styles';

export function QuizOptionList({ label, options, selections, onSelect }: QuizOptionListProps) {
  const selectedTitles = new Set(selections.map((value) => value.title));

  return (
    <View style={styles.options}>
      {options.map((option) => (
        <QuizOption
          key={option.title}
          label={label}
          tagValue={option}
          selected={selectedTitles.has(option.title)}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
}
