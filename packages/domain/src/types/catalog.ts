import type { IngredientTagValue, TagValue } from './tagValue.ts'

export interface Catalog {
  meatTypes: IngredientTagValue[]
  sideTypes: IngredientTagValue[]
  cuisineStyles: TagValue[]
  flavorProfiles: TagValue[]
}
