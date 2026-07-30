import { useState } from 'react'
import { calculateCalories } from '@menu/domain/utils/calculateCalories'
import type { Meal } from '@menu/domain/types/meal'
import type { IngredientTagValue, TagValue } from '@menu/domain/types/tagValue'

export interface IngredientSelection {
  tagValue: IngredientTagValue | null
  grams: number
}

function toggleTagValue(values: TagValue[], value: TagValue): TagValue[] {
  const isSelected = values.some((existing) => existing.title === value.title)
  return isSelected ? values.filter((existing) => existing.title !== value.title) : [...values, value]
}

export function useEditMealForm(meal: Meal, editMeal: (meal: Meal) => Promise<void>) {
  const [name, setName] = useState(meal.name)
  const [meatType, setMeatType] = useState<IngredientSelection>({
    tagValue: meal.meatType.tagValue,
    grams: meal.meatType.grams,
  })
  const [sideType, setSideType] = useState<IngredientSelection>({
    tagValue: meal.sideType.tagValue,
    grams: meal.sideType.grams,
  })
  const [cuisineStyles, setCuisineStyles] = useState<TagValue[]>(meal.cuisineStyles)
  const [flavorProfiles, setFlavorProfiles] = useState<TagValue[]>(meal.flavorProfiles)
  const [submitting, setSubmitting] = useState(false)

  const calories =
    meatType.tagValue && sideType.tagValue
      ? calculateCalories({
          meatType: { tagValue: meatType.tagValue, grams: meatType.grams },
          sideType: { tagValue: sideType.tagValue, grams: sideType.grams },
        })
      : 0

  const canSubmit =
    name.trim().length > 0 &&
    meatType.tagValue !== null &&
    sideType.tagValue !== null &&
    cuisineStyles.length > 0 &&
    flavorProfiles.length > 0

  function toggleCuisineStyle(value: TagValue) {
    setCuisineStyles((prev) => toggleTagValue(prev, value))
  }

  function toggleFlavorProfile(value: TagValue) {
    setFlavorProfiles((prev) => toggleTagValue(prev, value))
  }

  function submit(): Promise<void> | null {
    if (!canSubmit || !meatType.tagValue || !sideType.tagValue) return null
    setSubmitting(true)
    return editMeal({
      id: meal.id,
      name: name.trim(),
      meatType: { tagValue: meatType.tagValue, grams: meatType.grams },
      sideType: { tagValue: sideType.tagValue, grams: sideType.grams },
      cuisineStyles,
      flavorProfiles,
    }).finally(() => setSubmitting(false))
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
  }
}
