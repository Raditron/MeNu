import { useMemo, useState } from "react";
import type { TagValue } from "@menu/domain/types/tagValue";
import {
  getMealHistory,
  type MealHistoryDateRange,
} from "@menu/domain/utils/getMealHistory";
import { useMeals } from "../../../meal/hooks/useMeals";
import { useCategories } from "../../../meal/hooks/useCategories";
import { MealHistoryEntryRow } from "../../../meal/components/MealHistoryEntryRow/MealHistoryEntryRow";
import { MealSearchBar } from "../MealSearchBar/MealSearchBar";
import { TagMultiSelectField } from "../fields/TagMultiSelectField/TagMultiSelectField";
import type { DateRangeOption } from "./interfaces/MealHistoryPage.interface";
import styles from "./styles/MealHistoryPage.module.css";

const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { value: "last7Days", label: "Last 7 days" },
  { value: "last30Days", label: "Last 30 days" },
  { value: "allTime", label: "All time" },
];

type CategoryFilterKey =
  | "meatTypes"
  | "sideTypes"
  | "cuisineStyles"
  | "flavorProfiles";

const CATEGORY_FILTER_KEYS: Record<string, CategoryFilterKey> = {
  "Meat Type": "meatTypes",
  "Side Type": "sideTypes",
  "Cuisine Style": "cuisineStyles",
  "Flavor Profile": "flavorProfiles",
};

const EMPTY_SELECTED_TAGS: Record<CategoryFilterKey, TagValue[]> = {
  meatTypes: [],
  sideTypes: [],
  cuisineStyles: [],
  flavorProfiles: [],
};

function toggleTagValue(selected: TagValue[], value: TagValue): TagValue[] {
  const isSelected = selected.some((tag) => tag.title === value.title);
  return isSelected
    ? selected.filter((tag) => tag.title !== value.title)
    : [...selected, value];
}

export function MealHistoryPage() {
  const { meals, loading } = useMeals();
  const { categories } = useCategories();
  const [nameQuery, setNameQuery] = useState("");
  const [dateRange, setDateRange] = useState<MealHistoryDateRange>("allTime");
  const [selectedTags, setSelectedTags] = useState(EMPTY_SELECTED_TAGS);

  const hasActiveFilters =
    nameQuery !== "" ||
    dateRange !== "allTime" ||
    Object.values(selectedTags).some((tags) => tags.length > 0);

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
    setNameQuery("");
    setDateRange("allTime");
    setSelectedTags(EMPTY_SELECTED_TAGS);
  }

  return (
    <section>
      <div className={styles.pageHeader}>
        <h1>Meal History</h1>
        <h2>Everything you've eaten, newest first</h2>
      </div>
      <div className={styles.searchSection}>
        <p className={styles.searchLabel}>Looking for something specific?</p>
        <MealSearchBar value={nameQuery} onChange={setNameQuery} />
      </div>
      <div className={styles.filters}>
        <div className={styles.dateRangeGroup}>
          {DATE_RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.dateRangeOption}${
                dateRange === option.value ? ` ${styles.selected}` : ""
              }`}
              onClick={() => setDateRange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
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
                setSelectedTags((prev) => ({
                  ...prev,
                  [filterKey]: toggleTagValue(prev[filterKey], value),
                }))
              }
              collapsible
            />
          );
        })}
        {hasActiveFilters && (
          <button
            type="button"
            className={styles.clearFiltersButton}
            onClick={clearFilters}
          >
            Clear filters
          </button>
        )}
      </div>
      {loading ? (
        <p>Loading meal history…</p>
      ) : (
        <>
          {allEntries.length === 0 && <p>No meal history yet.</p>}
          {allEntries.length > 0 && entries.length === 0 && (
            <p>No meal history matches your filters.</p>
          )}
          {entries.length > 0 && (
            <ul className={styles.entryList}>
              {entries.map((entry, index) => (
                <MealHistoryEntryRow
                  key={`${entry.mealId}-${entry.date}-${index}`}
                  entry={entry}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
