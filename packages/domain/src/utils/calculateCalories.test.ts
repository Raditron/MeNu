import { describe, expect, it } from 'vitest'
import { calculateCalories } from './calculateCalories.ts'
import type { Portion } from '../types/meal.ts'

function portion(caloriesPerGram: number, grams: number): Portion {
  return { tagValue: { title: 'test', caloriesPerGram, icon: 'GiTest' }, grams }
}

describe('calculateCalories', () => {
  it('sums meat and side type calories by grams x calorie density', () => {
    const total = calculateCalories({
      meatType: portion(2.4, 100),
      sideType: portion(1.1, 50),
    })

    expect(total).toBe(2.4 * 100 + 1.1 * 50)
  })

  it('returns 0 when both portions are 0 grams', () => {
    const total = calculateCalories({
      meatType: portion(2.4, 0),
      sideType: portion(1.1, 0),
    })

    expect(total).toBe(0)
  })
})
