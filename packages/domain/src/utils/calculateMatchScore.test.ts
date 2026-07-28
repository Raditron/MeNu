import { describe, expect, it } from 'vitest'
import { calculateMatchScore } from './calculateMatchScore.ts'
import type { Meal } from '../types/meal.ts'
import type { Mood } from '../types/mood.ts'
import type { TagValue } from '../types/tagValue.ts'

function tagValue(title: string): TagValue {
  return { title }
}

function meal(overrides: Partial<Meal> = {}): Meal {
  return {
    id: '1',
    name: 'Test Meal',
    meatType: { tagValue: { title: 'pork', caloriesPerGram: 2.4, icon: 'GiPig' }, grams: 100 },
    sideType: { tagValue: { title: 'rice', caloriesPerGram: 1.1, icon: 'GiRice' }, grams: 100 },
    cuisineStyles: [tagValue('asian')],
    flavorProfiles: [tagValue('tangy')],
    ...overrides,
  }
}

function mood(overrides: Partial<Mood> = {}): Mood {
  return {
    meatType: tagValue('pork'),
    sideType: tagValue('rice'),
    cuisineStyles: [tagValue('asian')],
    flavorProfiles: [tagValue('tangy')],
    ...overrides,
  }
}

describe('calculateMatchScore', () => {
  it('scores 1 when every category matches exactly', () => {
    expect(calculateMatchScore(meal(), mood())).toBe(1)
  })

  it('scores 0 when nothing matches', () => {
    const score = calculateMatchScore(
      meal(),
      mood({
        meatType: tagValue('shrimp'),
        sideType: tagValue('pasta'),
        cuisineStyles: [tagValue('italian')],
        flavorProfiles: [tagValue('creamy')],
      }),
    )

    expect(score).toBe(0)
  })

  it('scores a multi-select category by fraction of the meal\'s values matched', () => {
    const score = calculateMatchScore(
      meal({ cuisineStyles: [tagValue('asian'), tagValue('indian')] }),
      mood({ cuisineStyles: [tagValue('asian')] }),
    )

    // meatType 1 + sideType 1 + cuisineStyles 0.5 + flavorProfiles 1, averaged over 4
    expect(score).toBe((1 + 1 + 0.5 + 1) / 4)
  })

  it('scores 0 for a multi-select category with zero Tag Values on the Meal, not undefined', () => {
    const score = calculateMatchScore(meal({ cuisineStyles: [] }), mood())

    expect(score).toBe((1 + 1 + 0 + 1) / 4)
  })
})
