import { FlatList } from 'react-native';

import { MealHistoryEntryRow } from '../MealHistoryEntryRow/MealHistoryEntryRow';
import type { MealHistoryEntryListProps } from './interfaces/MealHistoryEntryList.interface';
import { styles } from './styles/MealHistoryEntryList.styles';

export function MealHistoryEntryList({ entries }: MealHistoryEntryListProps) {
  return (
    <FlatList
      data={entries}
      keyExtractor={(entry, index) => `${entry.mealId}-${entry.date}-${index}`}
      renderItem={({ item }) => <MealHistoryEntryRow entry={item} />}
      contentContainerStyle={styles.content}
      scrollEnabled={false}
    />
  );
}
