import type { Catalog } from '@menu/domain/types/catalog';
import type { Meal, Portion } from '@menu/domain/types/meal';
import type { Mood } from '@menu/domain/types/mood';
import type { IngredientTagValue, TagValue } from '@menu/domain/types/tagValue';
import { API_BASE_URL } from '@/shared/api/config';

export type NewMeal = Omit<Meal, 'id'>;

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

function toBackendPortion(portion: Portion): BackendPortion {
  return { ingredient: portion.tagValue, grams: portion.grams };
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
  const response = await fetch(`${API_BASE_URL}/api/users/${uid}/meals`);

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error ?? 'Error fetching meals');
  }

  const meals: BackendMeal[] = await response.json();
  return meals.map(toMeal);
}

export async function getCatalog(): Promise<Catalog> {
  const response = await fetch(`${API_BASE_URL}/api/catalog`);

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error ?? 'Error fetching catalog');
  }

  return response.json();
}

export async function addMeal(uid: string, meal: NewMeal): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/users/${uid}/meal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      meal: {
        name: meal.name,
        meatType: toBackendPortion(meal.meatType),
        sideType: toBackendPortion(meal.sideType),
        cuisineStyles: meal.cuisineStyles,
        flavorProfiles: meal.flavorProfiles,
      },
    }),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error ?? 'Error adding meal');
  }
}

export async function submitQuiz(uid: string, mood: Mood): Promise<Meal[]> {
  const response = await fetch(`${API_BASE_URL}/api/users/${uid}/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mood }),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error ?? 'Error submitting quiz');
  }

  const { meals }: { meals: BackendMeal[] } = await response.json();
  return meals.map(toMeal);
}
