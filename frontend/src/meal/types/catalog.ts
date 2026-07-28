import type { IngredientTagValue, TagValue } from './tagValue'

export interface Catalog {
  meatTypes: IngredientTagValue[]
  sideTypes: IngredientTagValue[]
  cuisineStyles: TagValue[]
  flavorProfiles: TagValue[]
}
