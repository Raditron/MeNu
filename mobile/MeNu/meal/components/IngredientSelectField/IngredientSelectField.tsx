import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { useAppTheme } from '@/theme';
import type { IngredientSelectFieldProps } from './interfaces/IngredientSelectField.interface';
import { styles } from './styles/IngredientSelectField.styles';

export function IngredientSelectField({ label, options, selection, onChange }: IngredientSelectFieldProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.textH }]}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.options}>
        {options.map((option) => {
          const isSelected = selection.tagValue?.title === option.title;
          return (
            <Pressable
              key={option.title}
              testID={`${label}-option-${option.title}`}
              onPress={() => onChange({ ...selection, tagValue: option })}
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
      </ScrollView>
      <TextInput
        testID={`${label}-grams`}
        style={[styles.gramsInput, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
        placeholder="grams"
        placeholderTextColor={theme.textSoft}
        keyboardType="numeric"
        value={selection.grams ? String(selection.grams) : ''}
        onChangeText={(text) => onChange({ ...selection, grams: Number(text) || 0 })}
      />
    </View>
  );
}
