import type { IngredientTagValue, TagValue } from './tagValue.ts'

export interface Portion {
  tagValue: IngredientTagValue
  grams: number
}

export interface Meal {
  id: string
  name: string
  pictureUrl?: string
  youtubeUrl?: string
  meatType: Portion
  sideType: Portion
  cuisineStyles: TagValue[]
  flavorProfiles: TagValue[]
  numberOfPortions : number;
}
