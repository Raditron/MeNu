import { useMemo } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { calculateMatchScore } from '@menu/domain/utils/calculateMatchScore';

import { useAppTheme } from '@/theme';
import { MealCard } from '../../../meal/components/MealCard/MealCard';
import type { QuizResultsProps } from './interfaces/QuizResults.interface';
import { styles } from './styles/QuizResults.styles';

export function QuizResults({ mood, meals, onRestart }: QuizResultsProps) {
  const theme = useAppTheme();
  const rankedMeals = useMemo(
    () =>
      meals
        .map((meal) => ({ meal, matchScore: calculateMatchScore(meal, mood) }))
        .sort((a, b) => b.matchScore - a.matchScore),
    [meals, mood],
  );

  return (
    <View style={styles.results}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textH }]}>Your matches</Text>
        <Pressable testID="quiz-retake" onPress={onRestart}>
          <Text style={[styles.retake, { color: theme.accent }]}>Retake quiz</Text>
        </Pressable>
      </View>
      <FlatList
        data={rankedMeals}
        keyExtractor={({ meal }) => meal.id}
        renderItem={({ item }) => <MealCard meal={item.meal} matchScore={item.matchScore} />}
        contentContainerStyle={styles.list}
        scrollEnabled={false}
      />
    </View>
  );
}
