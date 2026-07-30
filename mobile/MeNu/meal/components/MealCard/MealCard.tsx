import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { calculateCalories } from '@menu/domain/utils/calculateCalories';

import { useAppTheme } from '@/theme';
import { EditButton } from './EditButton/EditButton';
import { IngredientIcon } from '../IngredientIcon/IngredientIcon';
import { MatchBadge } from '../MatchBadge/MatchBadge';
import { TagBadgeList } from '../TagBadgeList/TagBadgeList';
import type { MealCardProps } from './interfaces/MealCard.interface';
import { styles } from './styles/MealCard.styles';

export function MealCard({ meal, matchScore, editable }: MealCardProps) {
  const theme = useAppTheme();
  const calories = calculateCalories(meal);

  return (
    <Pressable
      testID="meal-card"
      onPress={() => router.push({ pathname: '/meal/[id]', params: { id: meal.id } })}
      style={[styles.card, { backgroundColor: theme.surface, borderRadius: theme.radiusCard }, theme.shadowCard]}
    >
      <View style={[styles.picture, { backgroundColor: theme.tagBg }]}>
        <IngredientIcon iconKey={meal.meatType.tagValue.icon} size={56} color={theme.textH} />
      </View>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: theme.textH }]}>{meal.name}</Text>
          {matchScore !== undefined && <MatchBadge matchScore={matchScore} />}
        </View>
        <Text style={[styles.portions, { color: theme.text }]}>
          {meal.meatType.tagValue.title} ({meal.meatType.grams}g) · {meal.sideType.tagValue.title} ({meal.sideType.grams}g)
        </Text>
        <TagBadgeList tagValues={[...meal.cuisineStyles, ...meal.flavorProfiles]} />
        <View style={styles.footer}>
          <Text style={[styles.calories, { color: theme.textH }]}>{Math.round(calories)} cal</Text>
          {editable && (
            <EditButton
              onPress={() => router.push({ pathname: '/edit-meal', params: { meal: JSON.stringify(meal) } })}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
}
