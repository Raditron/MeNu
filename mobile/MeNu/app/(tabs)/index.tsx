import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { MealList } from '@/meal/components/MealList/MealList';
import { useMeals } from '@/meal/hooks/useMeals';
import { useAppTheme } from '@/theme';

export default function MenuScreen() {
  const theme = useAppTheme();
  const { meals, loading } = useMeals();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.canvas }} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.textH }]}>Menu</Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>What do we feel like today?</Text>
        </View>
        <Link href="/add-meal" asChild>
          <Pressable testID="add-meal-button">
            <Text style={[styles.addMeal, { color: theme.accent }]}>+ Add Meal</Text>
          </Pressable>
        </Link>
      </View>
      {loading ? (
        <Text style={{ color: theme.text }}>Loading meals…</Text>
      ) : (
        <MealList meals={meals} />
      )}
      {meals.length === 0 && !loading && <Text style={{ color: theme.text }}>No meals yet.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  addMeal: {
    fontSize: 14,
    fontWeight: '600',
  },
});
