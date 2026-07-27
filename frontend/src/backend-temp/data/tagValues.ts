import type { Category } from '../../meal/types/category'
import type { IngredientTagValue, TagValue } from '../../meal/types/tagValue'

export const meatTypes: IngredientTagValue[] = [
  { title: 'pork', caloriesPerGram: 2.4 },
  { title: 'chicken', caloriesPerGram: 1.9 },
  { title: 'shrimp', caloriesPerGram: 1.1 },
  { title: 'beef', caloriesPerGram: 2.5 },
]

export const sideTypes: IngredientTagValue[] = [
  { title: 'salad', caloriesPerGram: 0.2 },
  { title: 'potatoes', caloriesPerGram: 0.9 },
  { title: 'rice', caloriesPerGram: 1.3 },
  { title: 'pasta', caloriesPerGram: 1.6 },
]

export const cuisineStyles: TagValue[] = [
  { title: 'asian' },
  { title: 'indian' },
  { title: 'italian' },
  { title: 'mexican' },
]

export const flavorProfiles: TagValue[] = [
  { title: 'creamy' },
  { title: 'tangy' },
  { title: 'tomato-y' },
  { title: 'spicy' },
]

export const categories: Category[] = [
  { name: 'Meat Type', selectionMode: 'single', options: meatTypes },
  { name: 'Side Type', selectionMode: 'single', options: sideTypes },
  { name: 'Cuisine Style', selectionMode: 'multi', options: cuisineStyles },
  { name: 'Flavor Profile', selectionMode: 'multi', options: flavorProfiles },
]
