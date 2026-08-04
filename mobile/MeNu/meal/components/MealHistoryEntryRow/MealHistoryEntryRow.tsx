import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/theme';
import { TagBadgeList } from '../TagBadgeList/TagBadgeList';
import type { MealHistoryEntryRowProps } from './interfaces/MealHistoryEntryRow.interface';
import { styles } from './styles/MealHistoryEntryRow.styles';

export function MealHistoryEntryRow({ entry }: MealHistoryEntryRowProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      testID="meal-history-entry"
      onPress={() => router.push({ pathname: '/meal/[id]', params: { id: entry.mealId } })}
      style={[styles.row, { backgroundColor: theme.surface, borderRadius: theme.radiusCard }, theme.shadowCard]}
    >
      <View style={styles.header}>
        <Text style={[styles.mealName, { color: theme.textH }]}>{entry.mealName}</Text>
        <Text style={[styles.date, { color: theme.textSoft }]}>{new Date(entry.date).toLocaleDateString()}</Text>
      </View>
      <TagBadgeList tagValues={[entry.meatType, entry.sideType, ...entry.cuisineStyles, ...entry.flavorProfiles]} />
    </Pressable>
  );
}
