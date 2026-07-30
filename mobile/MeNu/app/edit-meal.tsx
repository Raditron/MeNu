import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/auth/hooks/useAuth';
import { IngredientSelectField } from '@/meal/components/IngredientSelectField/IngredientSelectField';
import { TagMultiSelectField } from '@/meal/components/TagMultiSelectField/TagMultiSelectField';
import { editMeal } from '@/meal/api';
import { useEditMealForm } from '@/meal/hooks/useEditMealForm';
import { useCatalog } from '@/meal/hooks/useCatalog';
import { useAppTheme } from '@/theme';
import type { Meal } from '@menu/domain/types/meal';

export default function EditMealScreen() {
  const theme = useAppTheme();
  const { user } = useAuth();
  const { catalog, loading } = useCatalog();
  const { meal: mealParam } = useLocalSearchParams<{ meal: string }>();
  const meal: Meal = useMemo(() => JSON.parse(mealParam), [mealParam]);
  const form = useEditMealForm(meal, (editedMeal) => {
    if (!user) return Promise.reject(new Error('No authenticated user'));
    return editMeal(user.uid, editedMeal);
  });

  function handleSubmit() {
    const result = form.submit();
    if (!result) return;
    result.then(() => router.back());
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.canvas }} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: theme.textH }]}>Edit Meal</Text>
      {loading ? (
        <Text style={{ color: theme.text }}>Loading options…</Text>
      ) : (
        <>
          <TextInput
            style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
            placeholder="Meal name"
            placeholderTextColor={theme.textSoft}
            value={form.name}
            onChangeText={form.setName}
          />
          <IngredientSelectField
            label="Meat Type"
            options={catalog.meatTypes}
            selection={form.meatType}
            onChange={form.setMeatType}
          />
          <IngredientSelectField
            label="Side Type"
            options={catalog.sideTypes}
            selection={form.sideType}
            onChange={form.setSideType}
          />
          <TagMultiSelectField
            label="Cuisine Style"
            options={catalog.cuisineStyles}
            selected={form.cuisineStyles}
            onToggle={form.toggleCuisineStyle}
          />
          <TagMultiSelectField
            label="Flavor Profile"
            options={catalog.flavorProfiles}
            selected={form.flavorProfiles}
            onToggle={form.toggleFlavorProfile}
          />
          <Text style={[styles.calories, { color: theme.textH }]}>
            Total: {Math.round(form.calories)} cal
          </Text>
          <View style={styles.actions}>
            <Pressable testID="edit-meal-cancel" style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={[styles.cancelButtonText, { color: theme.textSoft }]}>Cancel</Text>
            </Pressable>
            <Pressable
              testID="edit-meal-submit"
              disabled={!form.canSubmit || form.submitting}
              onPress={handleSubmit}
              style={[
                styles.button,
                {
                  backgroundColor: theme.accent,
                  borderRadius: theme.radiusBtn,
                  opacity: form.canSubmit && !form.submitting ? 1 : 0.5,
                },
              ]}
            >
              <Text style={[styles.buttonText, { color: theme.accentCtaText }]}>
                {form.submitting ? 'Saving…' : 'Save Changes'}
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  calories: {
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  button: {
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
