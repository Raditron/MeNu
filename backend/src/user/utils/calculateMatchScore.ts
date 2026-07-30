import TagValue from "../../meal/domain/catalog/value-objects/TagValue.js";
import Meal from "../../meal/domain/entities/Meal.js";
import { Mood } from "../../meal/domain/value-objects/Mood.js";

function singleSelectScore(mealValue: TagValue, moodValue: TagValue): number {
  return mealValue.title === moodValue.title ? 1 : 0;
}

function multiSelectScore(
  mealValues: TagValue[],
  moodValues: TagValue[],
): number {
  if (mealValues.length === 0) return 0;
  const moodTitles = new Set(moodValues.map(value => value.title));
  const matchedCount = mealValues.filter(value =>
    moodTitles.has(value.title),
  ).length;
  return matchedCount / mealValues.length;
}

export function calculateMatchScore(meal: Meal, mood: Mood): number {
  const categoryScores = [
    singleSelectScore(meal.meatType.getIngredient(), mood.meatType),
    singleSelectScore(meal.sideType.getIngredient(), mood.sideType),
    multiSelectScore(meal.cuisineStyles ?? [], mood.cuisineStyles),
    multiSelectScore(meal.flavorProfiles ?? [], mood.flavorProfiles),
  ];
  return (
    categoryScores.reduce((sum, score) => sum + score, 0) /
    categoryScores.length
  );
}
