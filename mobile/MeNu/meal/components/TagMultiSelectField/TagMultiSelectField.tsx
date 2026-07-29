import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/theme';
import type { TagMultiSelectFieldProps } from './interfaces/TagMultiSelectField.interface';
import { styles } from './styles/TagMultiSelectField.styles';

export function TagMultiSelectField({ label, options, selected, onToggle }: TagMultiSelectFieldProps) {
  const theme = useAppTheme();
  const selectedTitles = new Set(selected.map((value) => value.title));

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.textH }]}>{label}</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const isSelected = selectedTitles.has(option.title);
          return (
            <Pressable
              key={option.title}
              testID={`${label}-option-${option.title}`}
              onPress={() => onToggle(option)}
              style={[
                styles.option,
                {
                  borderColor: isSelected ? theme.accentBorder : theme.border,
                  backgroundColor: isSelected ? theme.accentBg : theme.surface,
                },
              ]}
            >
              <Text style={{ color: isSelected ? theme.accent : theme.text }}>{option.title}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
