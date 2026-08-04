import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '../../../test/renderApp'
import { mockAuthState } from '../../../test/mocks/firebaseAuth'
import type { User } from 'firebase/auth'

const fakeUser = { uid: 'test-uid', email: 'user@example.com' } as User

const catalog = {
  meatTypes: [
    { title: 'Chicken', caloriesPerGram: 2, icon: 'GiChicken' },
    { title: 'Beef', caloriesPerGram: 3, icon: 'GiBeef' },
  ],
  sideTypes: [
    { title: 'Rice', caloriesPerGram: 1, icon: 'GiRice' },
    { title: 'Tortilla', caloriesPerGram: 1, icon: 'GiTortilla' },
  ],
  cuisineStyles: [{ title: 'Italian' }, { title: 'Mexican' }],
  flavorProfiles: [{ title: 'Spicy' }, { title: 'Savory' }],
}

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

const chickenAndRice = {
  id: 'meal-1',
  name: 'Chicken and Rice',
  meatType: { ingredient: catalog.meatTypes[0], grams: 100 },
  sideType: { ingredient: catalog.sideTypes[0], grams: 100 },
  cuisineStyles: [{ title: 'Italian' }],
  flavorProfiles: [{ title: 'Spicy' }],
  eatenHistory: [{ date: daysAgo(1) }, { date: daysAgo(10) }],
}

const beefTacos = {
  id: 'meal-2',
  name: 'Beef Tacos',
  meatType: { ingredient: catalog.meatTypes[1], grams: 120 },
  sideType: { ingredient: catalog.sideTypes[1], grams: 80 },
  cuisineStyles: [{ title: 'Mexican' }],
  flavorProfiles: [{ title: 'Savory' }],
  eatenHistory: [{ date: daysAgo(40) }],
}

function jsonResponse(body: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }),
  )
}

function stubFetchWithMeals(meals: unknown[]) {
  vi.stubGlobal(
    'fetch',
    vi.fn((input: unknown) => {
      const url = String(input)
      if (url.includes('/api/catalog')) return jsonResponse(catalog)
      if (url.includes('/meals')) return jsonResponse(meals)
      return jsonResponse([])
    }),
  )
}

function getHistoryLinks() {
  return screen
    .getAllByRole('link')
    .filter((link) => link.getAttribute('href')?.startsWith('/menu/'))
}

describe('Meal history page', () => {
  it('lists every eaten entry newest-first with the meal name and date', async () => {
    mockAuthState(fakeUser)
    stubFetchWithMeals([chickenAndRice, beefTacos])
    renderApp('/history')

    await waitFor(() => expect(getHistoryLinks()).toHaveLength(3))
    const links = getHistoryLinks()
    expect(links[0]).toHaveTextContent('Chicken and Rice')
    expect(links[1]).toHaveTextContent('Chicken and Rice')
    expect(links[2]).toHaveTextContent('Beef Tacos')
  })

  it('filters entries by meal name', async () => {
    mockAuthState(fakeUser)
    stubFetchWithMeals([chickenAndRice, beefTacos])
    const user = userEvent.setup()
    renderApp('/history')

    await waitFor(() => expect(getHistoryLinks()).toHaveLength(3))
    await user.type(screen.getByPlaceholderText('Use the search engine'), 'beef')

    await waitFor(() => expect(getHistoryLinks()).toHaveLength(1))
    expect(getHistoryLinks()[0]).toHaveTextContent('Beef Tacos')
  })

  it('filters entries by a preset date range', async () => {
    mockAuthState(fakeUser)
    stubFetchWithMeals([chickenAndRice, beefTacos])
    const user = userEvent.setup()
    renderApp('/history')

    await waitFor(() => expect(getHistoryLinks()).toHaveLength(3))
    await user.click(screen.getByRole('button', { name: 'Last 7 days' }))

    await waitFor(() => expect(getHistoryLinks()).toHaveLength(1))
    expect(getHistoryLinks()[0]).toHaveTextContent('Chicken and Rice')
  })

  it('filters entries by category', async () => {
    mockAuthState(fakeUser)
    stubFetchWithMeals([chickenAndRice, beefTacos])
    const user = userEvent.setup()
    renderApp('/history')

    await waitFor(() => expect(getHistoryLinks()).toHaveLength(3))
    await user.click(screen.getByRole('button', { name: 'Cuisine Style' }))
    await user.click(screen.getByRole('button', { name: 'Mexican' }))

    await waitFor(() => expect(getHistoryLinks()).toHaveLength(1))
    expect(getHistoryLinks()[0]).toHaveTextContent('Beef Tacos')
  })

  it('combines multiple filters', async () => {
    mockAuthState(fakeUser)
    stubFetchWithMeals([chickenAndRice, beefTacos])
    const user = userEvent.setup()
    renderApp('/history')

    await waitFor(() => expect(getHistoryLinks()).toHaveLength(3))
    await user.click(screen.getByRole('button', { name: 'Last 30 days' }))
    await user.click(screen.getByRole('button', { name: 'Cuisine Style' }))
    await user.click(screen.getByRole('button', { name: 'Mexican' }))

    expect(await screen.findByText('No meal history matches your filters.')).toBeInTheDocument()
  })

  it('clears active filters and shows the full history again', async () => {
    mockAuthState(fakeUser)
    stubFetchWithMeals([chickenAndRice, beefTacos])
    const user = userEvent.setup()
    renderApp('/history')

    await waitFor(() => expect(getHistoryLinks()).toHaveLength(3))
    await user.click(screen.getByRole('button', { name: 'Cuisine Style' }))
    await user.click(screen.getByRole('button', { name: 'Mexican' }))
    await waitFor(() => expect(getHistoryLinks()).toHaveLength(1))

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    await waitFor(() => expect(getHistoryLinks()).toHaveLength(3))
  })

  it('shows an empty state when nothing has been eaten yet', async () => {
    mockAuthState(fakeUser)
    stubFetchWithMeals([{ ...chickenAndRice, eatenHistory: [] }])
    renderApp('/history')

    expect(await screen.findByText('No meal history yet.')).toBeInTheDocument()
  })

  it('shows a distinct empty state when filters match nothing', async () => {
    mockAuthState(fakeUser)
    stubFetchWithMeals([chickenAndRice])
    const user = userEvent.setup()
    renderApp('/history')

    await screen.findAllByRole('listitem')
    await user.type(screen.getByPlaceholderText('Use the search engine'), 'nonexistent meal')

    expect(await screen.findByText('No meal history matches your filters.')).toBeInTheDocument()
  })

  it('links each entry back to its meal', async () => {
    mockAuthState(fakeUser)
    stubFetchWithMeals([beefTacos])
    renderApp('/history')

    const link = await screen.findByRole('link', { name: 'Beef Tacos' })
    expect(link).toHaveAttribute('href', '/menu/meal-2')
  })

  it('is reachable from the main nav', async () => {
    mockAuthState(fakeUser)
    stubFetchWithMeals([chickenAndRice])
    const user = userEvent.setup()
    renderApp('/menu')

    await user.click(screen.getByRole('link', { name: 'History' }))

    expect(await screen.findByRole('heading', { name: 'Meal History' })).toBeInTheDocument()
  })
})
