import type { Meal, Portion } from '@menu/domain/types/meal';
import type { IngredientTagValue, TagValue } from '@menu/domain/types/tagValue';

interface BackendPortion {
  ingredient: IngredientTagValue;
  grams: number;
}

interface BackendMeal {
  name: string;
  meatType: BackendPortion;
  sideType: BackendPortion;
  cuisineStyles?: TagValue[];
  flavorProfiles?: TagValue[];
}

function toPortion(portion: BackendPortion): Portion {
  return { tagValue: portion.ingredient, grams: portion.grams };
}

// Backend meals have no stable id yet, so one is derived from the fields
// that make a meal unique — good enough for a list key.
function toMealId(meal: BackendMeal): string {
  return [meal.name, meal.meatType.ingredient.title, meal.meatType.grams, meal.sideType.ingredient.title, meal.sideType.grams].join(
    '-',
  );
}

function toMeal(meal: BackendMeal): Meal {
  return {
    id: toMealId(meal),
    name: meal.name,
    meatType: toPortion(meal.meatType),
    sideType: toPortion(meal.sideType),
    cuisineStyles: meal.cuisineStyles ?? [],
    flavorProfiles: meal.flavorProfiles ?? [],
  };
}

export async function listMeals(uid: string): Promise<Meal[]> {
  const response = await fetch(`/api/users/${uid}/meals`);

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error ?? 'Error fetching meals');
  }

  const meals: BackendMeal[] = await response.json();
  return meals.map(toMeal);
}
