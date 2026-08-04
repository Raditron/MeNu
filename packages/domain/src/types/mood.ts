import type { TagValue } from './tagValue.ts'

export interface Mood {
  meatType: TagValue
  sideType: TagValue
  cuisineStyles: TagValue[] | null
  flavorProfiles: TagValue[] | null
}
