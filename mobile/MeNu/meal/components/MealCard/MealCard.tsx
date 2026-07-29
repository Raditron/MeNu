import { Text, View } from 'react-native';

import { calculateCalories } from '@menu/domain/utils/calculateCalories';

import { useAppTheme } from '@/theme';
import { TagBadgeList } from '../TagBadgeList/TagBadgeList';
import type { MealCardProps } from './interfaces/MealCard.interface';
import { styles } from './styles/MealCard.styles';

/** Real ingredient icon rendering lands in a follow-up ticket — this is a placeholder glyph. */
export function MealCard({ meal }: MealCardProps) {
  const theme = useAppTheme();
  const calories = calculateCalories(meal);

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderRadius: theme.radiusCard }, theme.shadowCard]}>
      <View style={[styles.picture, { backgroundColor: theme.tagBg }]}>
        <Text accessible={false} style={styles.pictureGlyph}>
          🍽️
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: theme.textH }]}>{meal.name}</Text>
        </View>
        <Text style={[styles.portions, { color: theme.text }]}>
          {meal.meatType.tagValue.title} ({meal.meatType.grams}g) · {meal.sideType.tagValue.title} ({meal.sideType.grams}g)
        </Text>
        <TagBadgeList tagValues={[...meal.cuisineStyles, ...meal.flavorProfiles]} />
        <Text style={[styles.calories, { color: theme.textH }]}>{Math.round(calories)} cal</Text>
      </View>
    </View>
  );
}
