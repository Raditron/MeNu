import { Pressable, Text, View } from 'react-native';

import type { IngredientTagValue } from '@menu/domain/types/tagValue';
import { IngredientIcon } from '@/meal/components/IngredientIcon/IngredientIcon';
import { useAppTheme } from '@/theme';
import type { QuizOptionProps } from './interfaces/QuizOption.interface';
import { styles } from './styles/QuizOption.styles';

function isIngredientTagValue(tagValue: QuizOptionProps['tagValue']): tagValue is IngredientTagValue {
  return 'icon' in tagValue;
}

export function QuizOption({ label, tagValue, selected, onSelect }: QuizOptionProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      testID={`${label}-option-${tagValue.title}`}
      accessibilityState={{ selected }}
      onPress={() => onSelect(tagValue)}
      style={[
        styles.option,
        {
          borderColor: selected ? theme.accentBorder : theme.border,
          backgroundColor: selected ? theme.accentBg : theme.surface,
        },
      ]}
    >
      {isIngredientTagValue(tagValue) && (
        <View>
          <IngredientIcon iconKey={tagValue.icon} size={32} color={selected ? theme.accent : theme.text} />
        </View>
      )}
      <Text style={{ color: selected ? theme.accent : theme.text }}>{tagValue.title}</Text>
    </Pressable>
  );
}
