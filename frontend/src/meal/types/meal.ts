import type { IngredientTagValue, TagValue } from './tagValue'

export interface Portion {
  tagValue: IngredientTagValue
  grams: number
}

export interface Meal {
  id: string
  name: string
  pictureUrl: string
  meatType: Portion
  sideType: Portion
  cuisineStyles: TagValue[]
  flavorProfiles: TagValue[]
}
