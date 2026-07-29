import { FlatList } from 'react-native';

import { MealCard } from '../MealCard/MealCard';
import type { MealListProps } from './interfaces/MealList.interface';
import { styles } from './styles/MealList.styles';

export function MealList({ meals }: MealListProps) {
  return (
    <FlatList
      data={meals}
      keyExtractor={(meal) => meal.id}
      renderItem={({ item }) => <MealCard meal={item} />}
      contentContainerStyle={styles.content}
      scrollEnabled={false}
    />
  );
}
