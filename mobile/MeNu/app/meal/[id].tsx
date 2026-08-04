import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { calculateCalories } from '@menu/domain/utils/calculateCalories';
import { getYoutubeEmbedUrl } from '@menu/domain/utils/getYoutubeEmbedUrl';
import { IngredientIcon } from '@/meal/components/IngredientIcon/IngredientIcon';
import { TagBadgeList } from '@/meal/components/TagBadgeList/TagBadgeList';
import { useEatMeal } from '@/meal/hooks/useEatMeal';
import { useMeal } from '@/meal/hooks/useMeal';
import { useAppTheme } from '@/theme';

export default function MealDetailsScreen() {
  const theme = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { meal, loading } = useMeal(id);
  const { eatMeal, submitting, justAte, error } = useEatMeal(id);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.canvas }]}>
        <Text style={{ color: theme.text }}>Loading meal…</Text>
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.canvas }]}>
        <Text style={{ color: theme.text }}>Meal not found.</Text>
        <Pressable testID="meal-details-back" onPress={() => router.back()}>
          <Text style={[styles.link, { color: theme.accent }]}>Back to Menu</Text>
        </Pressable>
      </View>
    );
  }

  const calories = calculateCalories(meal);
  const embedUrl = getYoutubeEmbedUrl(meal.youtubeUrl);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.canvas }} contentContainerStyle={styles.content}>
      <Pressable testID="meal-details-back" style={styles.backButton} onPress={() => router.back()}>
        <Text style={[styles.backButtonText, { color: theme.text }]}>← Back to Menu</Text>
      </Pressable>
      <View style={[styles.picture, { backgroundColor: theme.tagBg }]}>
        <IngredientIcon iconKey={meal.meatType.tagValue.icon} size={96} color={theme.textH} />
      </View>
      <Text style={[styles.title, { color: theme.textH }]}>{meal.name}</Text>
      <Text style={[styles.portions, { color: theme.text }]}>
        {meal.meatType.tagValue.title} ({meal.meatType.grams}g) · {meal.sideType.tagValue.title} ({meal.sideType.grams}g)
      </Text>
      <TagBadgeList tagValues={[...meal.cuisineStyles, ...meal.flavorProfiles]} />
      <Pressable
        testID="mark-eaten-button"
        disabled={submitting}
        onPress={() => eatMeal()}
        style={[
          styles.eatButton,
          { borderRadius: theme.radiusBtn, backgroundColor: theme.accent, opacity: submitting ? 0.6 : 1 },
        ]}
      >
        <Text style={[styles.eatButtonText, { color: theme.accentCtaText }]}>Mark as eaten</Text>
      </Pressable>
      {justAte && (
        <Text style={[styles.eatConfirmation, { color: theme.textSoft }]}>Marked as eaten ✓</Text>
      )}
      {error && (
        <Text testID="eat-meal-error" style={[styles.eatConfirmation, { color: theme.danger }]}>
          {error.message}
        </Text>
      )}
      <View
        style={[
          styles.stats,
          { borderRadius: theme.radiusBtn, backgroundColor: theme.accentBg, borderColor: theme.accentBorder },
        ]}
      >
        <Text style={[styles.calories, { color: theme.textH }]}>{Math.round(calories)} cal</Text>
        <Text style={[styles.calPerPortion, { backgroundColor: theme.tagBg, color: theme.tagText }]}>
          {Math.round(meal.calPerPortion)} cal/portion
        </Text>
        <Text style={[styles.calories, { color: theme.textH }]}>Serves {meal.numberOfPortions} portions</Text>
      </View>
      {embedUrl ? (
        <View style={[styles.videoWrapper, { backgroundColor: theme.tagBg }]}>
          <WebView
            testID="meal-video"
            style={styles.video}
            source={{ uri: embedUrl }}
            allowsFullscreenVideo
          />
        </View>
      ) : (
        <Text style={[styles.noVideo, { color: theme.textSoft }]}>
          No video attached, edit the meal to add one.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  picture: {
    height: 200,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  portions: {
    fontSize: 14,
  },
  eatButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  eatButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  eatConfirmation: {
    fontSize: 14,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  calories: {
    fontSize: 16,
    fontWeight: '600',
  },
  calPerPortion: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 999,
    fontSize: 13,
    overflow: 'hidden',
  },
  videoWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 20,
    overflow: 'hidden',
  },
  video: {
    flex: 1,
  },
  noVideo: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  link: {
    fontSize: 16,
    fontWeight: '600',
  },
});
