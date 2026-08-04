import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { TagValue } from '@menu/domain/types/tagValue';
import { getMealHistory, type MealHistoryDateRange } from '@menu/domain/utils/getMealHistory';

import { MealHistoryEntryList } from '@/meal/components/MealHistoryEntryList/MealHistoryEntryList';
import { MealSearchBar } from '@/meal/components/MealSearchBar/MealSearchBar';
import { TagMultiSelectField } from '@/meal/components/TagMultiSelectField/TagMultiSelectField';
import { useCategories } from '@/meal/hooks/useCategories';
import { useMeals } from '@/meal/hooks/useMeals';
import { useAppTheme } from '@/theme';

const DATE_RANGE_OPTIONS: { value: MealHistoryDateRange; label: string }[] = [
  { value: 'last7Days', label: 'Last 7 days' },
  { value: 'last30Days', label: 'Last 30 days' },
  { value: 'allTime', label: 'All time' },
];

type CategoryFilterKey = 'meatTypes' | 'sideTypes' | 'cuisineStyles' | 'flavorProfiles';

const CATEGORY_FILTER_KEYS: Record<string, CategoryFilterKey> = {
  'Meat Type': 'meatTypes',
  'Side Type': 'sideTypes',
  'Cuisine Style': 'cuisineStyles',
  'Flavor Profile': 'flavorProfiles',
};

const EMPTY_SELECTED_TAGS: Record<CategoryFilterKey, TagValue[]> = {
  meatTypes: [],
  sideTypes: [],
  cuisineStyles: [],
  flavorProfiles: [],
};

function toggleTagValue(selected: TagValue[], value: TagValue): TagValue[] {
  const isSelected = selected.some((tag) => tag.title === value.title);
  return isSelected ? selected.filter((tag) => tag.title !== value.title) : [...selected, value];
}

export default function HistoryScreen() {
  const theme = useAppTheme();
  const { meals, loading } = useMeals();
  const { categories } = useCategories();
  const [nameQuery, setNameQuery] = useState('');
  const [dateRange, setDateRange] = useState<MealHistoryDateRange>('allTime');
  const [selectedTags, setSelectedTags] = useState(EMPTY_SELECTED_TAGS);

  const hasActiveFilters =
    nameQuery !== '' || dateRange !== 'allTime' || Object.values(selectedTags).some((tags) => tags.length > 0);

  const allEntries = useMemo(() => getMealHistory(meals), [meals]);
  const entries = useMemo(
    () =>
      getMealHistory(meals, {
        nameQuery,
        dateRange,
        meatTypes: selectedTags.meatTypes.map((tag) => tag.title),
        sideTypes: selectedTags.sideTypes.map((tag) => tag.title),
        cuisineStyles: selectedTags.cuisineStyles.map((tag) => tag.title),
        flavorProfiles: selectedTags.flavorProfiles.map((tag) => tag.title),
      }),
    [meals, nameQuery, dateRange, selectedTags],
  );

  function clearFilters() {
    setNameQuery('');
    setDateRange('allTime');
    setSelectedTags(EMPTY_SELECTED_TAGS);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.canvas }} contentContainerStyle={styles.content}>
      <View>
        <Text style={[styles.title, { color: theme.textH }]}>Meal History</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>Everything you've eaten, newest first</Text>
      </View>
      <View style={styles.searchSection}>
        <Text style={[styles.searchLabel, { color: theme.textSoft }]}>Looking for something specific?</Text>
        <MealSearchBar value={nameQuery} onChange={setNameQuery} />
      </View>
      <View style={styles.filters}>
        <View style={styles.dateRangeGroup}>
          {DATE_RANGE_OPTIONS.map((option) => {
            const isSelected = dateRange === option.value;
            return (
              <Pressable
                key={option.value}
                testID={`date-range-${option.value}`}
                onPress={() => setDateRange(option.value)}
                style={[
                  styles.dateRangeOption,
                  {
                    borderColor: isSelected ? theme.accentBorder : theme.border,
                    backgroundColor: isSelected ? theme.accentBg : theme.surface,
                  },
                ]}
              >
                <Text style={{ color: isSelected ? theme.accent : theme.text }}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
        {categories.map((category) => {
          const filterKey = CATEGORY_FILTER_KEYS[category.name];
          if (!filterKey) return null;
          return (
            <TagMultiSelectField
              key={category.name}
              label={category.name}
              options={category.options}
              selected={selectedTags[filterKey]}
              onToggle={(value) =>
                setSelectedTags((prev) => ({ ...prev, [filterKey]: toggleTagValue(prev[filterKey], value) }))
              }
            />
          );
        })}
        {hasActiveFilters && (
          <Pressable testID="clear-filters-button" onPress={clearFilters}>
            <Text style={[styles.clearFilters, { color: theme.accent }]}>Clear filters</Text>
          </Pressable>
        )}
      </View>
      {loading ? (
        <Text style={{ color: theme.text }}>Loading meal history…</Text>
      ) : (
        <>
          {allEntries.length === 0 && <Text style={{ color: theme.text }}>No meal history yet.</Text>}
          {allEntries.length > 0 && entries.length === 0 && (
            <Text style={{ color: theme.text }}>No meal history matches your filters.</Text>
          )}
          {entries.length > 0 && <MealHistoryEntryList entries={entries} />}
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
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  searchSection: {
    gap: 8,
  },
  searchLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  filters: {
    gap: 16,
  },
  dateRangeGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateRangeOption: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearFilters: {
    fontSize: 14,
    fontWeight: '600',
  },
});
