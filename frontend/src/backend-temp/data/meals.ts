import type { Meal } from '../../meal/types/meal'
import type { TagValue } from '../../meal/types/tagValue'
import { cuisineStyles, flavorProfiles, meatTypes, sideTypes } from './tagValues'

function findTagValue<T extends TagValue>(values: T[], title: string): T {
  const found = values.find((value) => value.title === title)
  if (!found) throw new Error(`Unknown tag value: ${title}`)
  return found
}

export const PLACEHOLDER_MEAL_PICTURE = '/placeholder-meal.svg'

export const seedMeals: Meal[] = [
  {
    id: 'seed-1',
    name: 'Pork Fried Rice',
    pictureUrl: PLACEHOLDER_MEAL_PICTURE,
    meatType: { tagValue: findTagValue(meatTypes, 'pork'), grams: 150 },
    sideType: { tagValue: findTagValue(sideTypes, 'rice'), grams: 200 },
    cuisineStyles: [findTagValue(cuisineStyles, 'asian')],
    flavorProfiles: [findTagValue(flavorProfiles, 'creamy')],
  },
  {
    id: 'seed-2',
    name: 'Tandoori Chicken with Potatoes',
    pictureUrl: PLACEHOLDER_MEAL_PICTURE,
    meatType: { tagValue: findTagValue(meatTypes, 'chicken'), grams: 180 },
    sideType: { tagValue: findTagValue(sideTypes, 'potatoes'), grams: 220 },
    cuisineStyles: [findTagValue(cuisineStyles, 'indian')],
    flavorProfiles: [findTagValue(flavorProfiles, 'spicy'), findTagValue(flavorProfiles, 'tangy')],
  },
  {
    id: 'seed-3',
    name: 'Shrimp Pasta',
    pictureUrl: PLACEHOLDER_MEAL_PICTURE,
    meatType: { tagValue: findTagValue(meatTypes, 'shrimp'), grams: 120 },
    sideType: { tagValue: findTagValue(sideTypes, 'pasta'), grams: 200 },
    cuisineStyles: [findTagValue(cuisineStyles, 'italian')],
    flavorProfiles: [findTagValue(flavorProfiles, 'tomato-y')],
  },
  {
    id: 'seed-4',
    name: 'Beef Taco Salad',
    pictureUrl: PLACEHOLDER_MEAL_PICTURE,
    meatType: { tagValue: findTagValue(meatTypes, 'beef'), grams: 160 },
    sideType: { tagValue: findTagValue(sideTypes, 'salad'), grams: 150 },
    cuisineStyles: [findTagValue(cuisineStyles, 'mexican')],
    flavorProfiles: [findTagValue(flavorProfiles, 'spicy'), findTagValue(flavorProfiles, 'tangy')],
  },
  {
    id: 'seed-5',
    name: 'Creamy Chicken Pasta',
    pictureUrl: PLACEHOLDER_MEAL_PICTURE,
    meatType: { tagValue: findTagValue(meatTypes, 'chicken'), grams: 170 },
    sideType: { tagValue: findTagValue(sideTypes, 'pasta'), grams: 210 },
    cuisineStyles: [findTagValue(cuisineStyles, 'italian')],
    flavorProfiles: [findTagValue(flavorProfiles, 'creamy')],
  },
]
