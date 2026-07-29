import { useState } from 'react';

import { calculateCalories } from '@menu/domain/utils/calculateCalories';
import type { IngredientTagValue, TagValue } from '@menu/domain/types/tagValue';
import type { NewMeal } from '../api';

export interface IngredientSelection {
  tagValue: IngredientTagValue | null;
  grams: number;
}

const emptyIngredient: IngredientSelection = { tagValue: null, grams: 0 };

function toggleTagValue(values: TagValue[], value: TagValue): TagValue[] {
  const isSelected = values.some((existing) => existing.title === value.title);
  return isSelected ? values.filter((existing) => existing.title !== value.title) : [...values, value];
}

export function useAddMealForm(addMeal: (meal: NewMeal) => Promise<void>) {
  const [name, setName] = useState('');
  const [meatType, setMeatType] = useState<IngredientSelection>(emptyIngredient);
  const [sideType, setSideType] = useState<IngredientSelection>(emptyIngredient);
  const [cuisineStyles, setCuisineStyles] = useState<TagValue[]>([]);
  const [flavorProfiles, setFlavorProfiles] = useState<TagValue[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const calories =
    meatType.tagValue && sideType.tagValue
      ? calculateCalories({
          meatType: { tagValue: meatType.tagValue, grams: meatType.grams },
          sideType: { tagValue: sideType.tagValue, grams: sideType.grams },
        })
      : 0;

  const canSubmit =
    name.trim().length > 0 &&
    meatType.tagValue !== null &&
    sideType.tagValue !== null &&
    cuisineStyles.length > 0 &&
    flavorProfiles.length > 0;

  function toggleCuisineStyle(value: TagValue) {
    setCuisineStyles((prev) => toggleTagValue(prev, value));
  }

  function toggleFlavorProfile(value: TagValue) {
    setFlavorProfiles((prev) => toggleTagValue(prev, value));
  }

  function submit(): Promise<void> | null {
    if (!canSubmit || !meatType.tagValue || !sideType.tagValue) return null;
    setSubmitting(true);
    return addMeal({
      name: name.trim(),
      meatType: { tagValue: meatType.tagValue, grams: meatType.grams },
      sideType: { tagValue: sideType.tagValue, grams: sideType.grams },
      cuisineStyles,
      flavorProfiles,
    }).finally(() => setSubmitting(false));
  }

  return {
    name,
    setName,
    meatType,
    setMeatType,
    sideType,
    setSideType,
    cuisineStyles,
    toggleCuisineStyle,
    flavorProfiles,
    toggleFlavorProfile,
    calories,
    canSubmit,
    submitting,
    submit,
  };
}
