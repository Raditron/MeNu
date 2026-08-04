import { describe, expect, it } from 'vitest'
import { getMealHistory } from './getMealHistory.ts'
import type { Meal } from '../types/meal.ts'
import type { TagValue } from '../types/tagValue.ts'

function tagValue(title: string): TagValue {
  return { title }
}

function meal(overrides: Partial<Meal> = {}): Meal {
  return {
    id: '1',
    name: 'Chicken and rice',
    meatType: { tagValue: tagValue('chicken'), grams: 200 },
    sideType: { tagValue: tagValue('rice'), grams: 150 },
    cuisineStyles: [tagValue('asian')],
    flavorProfiles: [tagValue('savory')],
    eatenHistory: [],
    ...overrides,
  } as Meal
}

const NOW = new Date('2026-08-04T12:00:00.000Z')

describe('getMealHistory', () => {
  it('returns an empty list when there are no meals', () => {
    expect(getMealHistory([], {}, NOW)).toEqual([])
  })

  it('returns an empty list when no meal has any Eaten Entries', () => {
    expect(getMealHistory([meal({ eatenHistory: [] })], {}, NOW)).toEqual([])
  })

  it('flattens every Meal\'s Eaten History into a single list, newest first', () => {
    const chicken = meal({
      id: '1',
      name: 'Chicken and rice',
      eatenHistory: [{ date: '2026-08-01T00:00:00.000Z' }, { date: '2026-08-03T00:00:00.000Z' }],
    })
    const pasta = meal({
      id: '2',
      name: 'Pasta',
      eatenHistory: [{ date: '2026-08-02T00:00:00.000Z' }],
    })

    const history = getMealHistory([chicken, pasta], {}, NOW)

    expect(history.map((entry) => entry.date)).toEqual([
      '2026-08-03T00:00:00.000Z',
      '2026-08-02T00:00:00.000Z',
      '2026-08-01T00:00:00.000Z',
    ])
    expect(history[0]).toMatchObject({ mealId: '1', mealName: 'Chicken and rice' })
  })

  it('filters by a case-insensitive meal name substring', () => {
    const chicken = meal({ id: '1', name: 'Chicken and rice', eatenHistory: [{ date: '2026-08-01T00:00:00.000Z' }] })
    const pasta = meal({ id: '2', name: 'Pasta', eatenHistory: [{ date: '2026-08-01T00:00:00.000Z' }] })

    const history = getMealHistory([chicken, pasta], { nameQuery: 'CHICK' }, NOW)

    expect(history.map((entry) => entry.mealId)).toEqual(['1'])
  })

  it('includes entries from exactly 7 days ago under the last7Days preset', () => {
    const boundary = meal({
      id: '1',
      eatenHistory: [{ date: new Date('2026-07-28T12:00:00.000Z').toISOString() }],
    })
    const justOutside = meal({
      id: '2',
      eatenHistory: [{ date: new Date('2026-07-28T11:59:59.000Z').toISOString() }],
    })

    const history = getMealHistory([boundary, justOutside], { dateRange: 'last7Days' }, NOW)

    expect(history.map((entry) => entry.mealId)).toEqual(['1'])
  })

  it('includes entries from exactly 30 days ago under the last30Days preset', () => {
    const boundary = meal({
      id: '1',
      eatenHistory: [{ date: new Date('2026-07-05T12:00:00.000Z').toISOString() }],
    })
    const justOutside = meal({
      id: '2',
      eatenHistory: [{ date: new Date('2026-07-05T11:59:59.000Z').toISOString() }],
    })

    const history = getMealHistory([boundary, justOutside], { dateRange: 'last30Days' }, NOW)

    expect(history.map((entry) => entry.mealId)).toEqual(['1'])
  })

  it('includes everything under the allTime preset', () => {
    const old = meal({ id: '1', eatenHistory: [{ date: '2020-01-01T00:00:00.000Z' }] })

    const history = getMealHistory([old], { dateRange: 'allTime' }, NOW)

    expect(history.map((entry) => entry.mealId)).toEqual(['1'])
  })

  it('filters by Meat Type', () => {
    const chicken = meal({
      id: '1',
      meatType: { tagValue: tagValue('chicken'), grams: 200 },
      eatenHistory: [{ date: '2026-08-01T00:00:00.000Z' }],
    })
    const pork = meal({
      id: '2',
      meatType: { tagValue: tagValue('pork'), grams: 200 },
      eatenHistory: [{ date: '2026-08-01T00:00:00.000Z' }],
    })

    const history = getMealHistory([chicken, pork], { meatTypes: ['chicken'] }, NOW)

    expect(history.map((entry) => entry.mealId)).toEqual(['1'])
  })

  it('filters by Side Type', () => {
    const rice = meal({
      id: '1',
      sideType: { tagValue: tagValue('rice'), grams: 150 },
      eatenHistory: [{ date: '2026-08-01T00:00:00.000Z' }],
    })
    const pasta = meal({
      id: '2',
      sideType: { tagValue: tagValue('pasta'), grams: 150 },
      eatenHistory: [{ date: '2026-08-01T00:00:00.000Z' }],
    })

    const history = getMealHistory([rice, pasta], { sideTypes: ['pasta'] }, NOW)

    expect(history.map((entry) => entry.mealId)).toEqual(['2'])
  })

  it('filters by Cuisine Style, matching if any selected value is present (OR)', () => {
    const asian = meal({ id: '1', cuisineStyles: [tagValue('asian')], eatenHistory: [{ date: '2026-08-01T00:00:00.000Z' }] })
    const italian = meal({ id: '2', cuisineStyles: [tagValue('italian')], eatenHistory: [{ date: '2026-08-01T00:00:00.000Z' }] })
    const indian = meal({ id: '3', cuisineStyles: [tagValue('indian')], eatenHistory: [{ date: '2026-08-01T00:00:00.000Z' }] })

    const history = getMealHistory([asian, italian, indian], { cuisineStyles: ['asian', 'italian'] }, NOW)

    expect(history.map((entry) => entry.mealId).sort()).toEqual(['1', '2'])
  })

  it('filters by Flavor Profile, matching if any selected value is present (OR)', () => {
    const savory = meal({ id: '1', flavorProfiles: [tagValue('savory')], eatenHistory: [{ date: '2026-08-01T00:00:00.000Z' }] })
    const tangy = meal({ id: '2', flavorProfiles: [tagValue('tangy')], eatenHistory: [{ date: '2026-08-01T00:00:00.000Z' }] })

    const history = getMealHistory([savory, tangy], { flavorProfiles: ['tangy'] }, NOW)

    expect(history.map((entry) => entry.mealId)).toEqual(['2'])
  })

  it('combines filters across dimensions as AND', () => {
    const match = meal({
      id: '1',
      name: 'Chicken and rice',
      meatType: { tagValue: tagValue('chicken'), grams: 200 },
      eatenHistory: [{ date: '2026-08-03T00:00:00.000Z' }],
    })
    const wrongName = meal({
      id: '2',
      name: 'Pasta',
      meatType: { tagValue: tagValue('chicken'), grams: 200 },
      eatenHistory: [{ date: '2026-08-03T00:00:00.000Z' }],
    })
    const wrongMeatType = meal({
      id: '3',
      name: 'Chicken and pasta',
      meatType: { tagValue: tagValue('pork'), grams: 200 },
      eatenHistory: [{ date: '2026-08-03T00:00:00.000Z' }],
    })
    const outsideRange = meal({
      id: '4',
      name: 'Chicken and potatoes',
      meatType: { tagValue: tagValue('chicken'), grams: 200 },
      eatenHistory: [{ date: '2020-01-01T00:00:00.000Z' }],
    })

    const history = getMealHistory(
      [match, wrongName, wrongMeatType, outsideRange],
      { nameQuery: 'chicken', meatTypes: ['chicken'], dateRange: 'last7Days' },
      NOW,
    )

    expect(history.map((entry) => entry.mealId)).toEqual(['1'])
  })

  it('produces one entry per Eaten Entry, not deduped or grouped by Meal', () => {
    const chicken = meal({
      id: '1',
      eatenHistory: [
        { date: '2026-08-01T00:00:00.000Z' },
        { date: '2026-08-02T00:00:00.000Z' },
        { date: '2026-08-03T00:00:00.000Z' },
      ],
    })

    expect(getMealHistory([chicken], {}, NOW)).toHaveLength(3)
  })
})
