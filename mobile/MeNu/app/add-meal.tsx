import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/auth/hooks/useAuth';
import { IngredientSelectField } from '@/meal/components/IngredientSelectField/IngredientSelectField';
import { TagMultiSelectField } from '@/meal/components/TagMultiSelectField/TagMultiSelectField';
import { addMeal } from '@/meal/api';
import { useAddMealForm } from '@/meal/hooks/useAddMealForm';
import { useCatalog } from '@/meal/hooks/useCatalog';
import { useAppTheme } from '@/theme';

export default function AddMealScreen() {
  const theme = useAppTheme();
  const { user } = useAuth();
  const { catalog, loading } = useCatalog();
  const form = useAddMealForm((meal) => {
    if (!user) return Promise.reject(new Error('No authenticated user'));
    return addMeal(user.uid, meal);
  });

  function handleSubmit() {
    const result = form.submit();
    if (!result) return;
    result.then(() => router.back());
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.canvas }} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: theme.textH }]}>Add Meal</Text>
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
          <TextInput
            style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surface }]}
            placeholder="YouTube video URL (optional)"
            placeholderTextColor={theme.textSoft}
            autoCapitalize="none"
            keyboardType="url"
            value={form.youtubeUrl}
            onChangeText={form.setYoutubeUrl}
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
            <Pressable testID="add-meal-cancel" style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={[styles.cancelButtonText, { color: theme.textSoft }]}>Cancel</Text>
            </Pressable>
            <Pressable
              testID="add-meal-submit"
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
                {form.submitting ? 'Adding…' : 'Add Meal'}
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
