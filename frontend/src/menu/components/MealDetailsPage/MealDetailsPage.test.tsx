import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderApp } from '../../../test/renderApp'
import { mockAuthState } from '../../../test/mocks/firebaseAuth'
import type { User } from 'firebase/auth'

const fakeUser = { uid: 'test-uid', email: 'user@example.com' } as User

const catalog = {
  meatTypes: [{ title: 'Chicken', caloriesPerGram: 2, icon: 'GiChicken' }],
  sideTypes: [{ title: 'Rice', caloriesPerGram: 1, icon: 'GiRice' }],
  cuisineStyles: [{ title: 'Italian' }],
  flavorProfiles: [{ title: 'Spicy' }],
}

const existingMeal = {
  id: 'meal-1',
  name: 'Chicken and Rice',
  meatType: { ingredient: catalog.meatTypes[0], grams: 100 },
  sideType: { ingredient: catalog.sideTypes[0], grams: 100 },
  cuisineStyles: [{ title: 'Italian' }],
  flavorProfiles: [{ title: 'Spicy' }],
}

function jsonResponse(body: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }),
  )
}

function stubFetchWithMealById(meal: unknown | null) {
  vi.stubGlobal(
    'fetch',
    vi.fn((input: unknown) => {
      const url = String(input)
      if (url.includes('/api/catalog')) return jsonResponse(catalog)
      if (/\/meal\/[^/]+$/.test(url)) {
        return meal ? jsonResponse(meal) : jsonResponse({ error: 'Meal not found' }, 404)
      }
      if (url.includes('/meals')) return jsonResponse([existingMeal])
      return jsonResponse([])
    }),
  )
}

describe('Meal details page', () => {
  it('navigates from the Menu to a meal\'s details page when its card is clicked', async () => {
    mockAuthState(fakeUser)
    stubFetchWithMealById(existingMeal)
    const user = userEvent.setup()
    renderApp('/menu')

    await user.click(await screen.findByText('Chicken and Rice'))

    expect(await screen.findByRole('heading', { name: 'Chicken and Rice' })).toBeInTheDocument()
    expect(screen.getByText('Chicken (100g) · Rice (100g)')).toBeInTheDocument()
    expect(screen.getByText('Italian')).toBeInTheDocument()
    expect(screen.getByText('Spicy')).toBeInTheDocument()
    expect(screen.getByText('300 cal')).toBeInTheDocument()
  })

  it('renders correctly from a fresh fetch when navigated to directly', async () => {
    mockAuthState(fakeUser)
    stubFetchWithMealById(existingMeal)
    renderApp('/menu/meal-1')

    expect(await screen.findByRole('heading', { name: 'Chicken and Rice' })).toBeInTheDocument()
    expect(screen.getByText('300 cal')).toBeInTheDocument()
  })

  it('shows a "meal not found" message with a link back to the Menu for an id that does not resolve', async () => {
    mockAuthState(fakeUser)
    stubFetchWithMealById(null)
    renderApp('/menu/does-not-exist')

    expect(await screen.findByText('Meal not found.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Menu' })).toHaveAttribute('href', '/menu')
  })

  it('clicking the edit control does not navigate to the details page', async () => {
    mockAuthState(fakeUser)
    stubFetchWithMealById(existingMeal)
    const user = userEvent.setup()
    renderApp('/menu')

    await user.click(await screen.findByRole('button', { name: 'Edit meal' }))

    expect(screen.getByRole('heading', { name: 'Edit Meal' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Menu', level: 1 })).toBeInTheDocument()
  })

  it('shows a fallback message when the meal has no video attached', async () => {
    mockAuthState(fakeUser)
    stubFetchWithMealById(existingMeal)
    renderApp('/menu/meal-1')

    expect(await screen.findByText('No video attached, edit the meal to add one.')).toBeInTheDocument()
    expect(screen.queryByTitle('Chicken and Rice video')).not.toBeInTheDocument()
  })

  it('embeds the YouTube video when the meal has a youtubeUrl', async () => {
    mockAuthState(fakeUser)
    stubFetchWithMealById({ ...existingMeal, youtubeURL: 'https://www.youtube.com/watch?v=abc123' })
    renderApp('/menu/meal-1')

    const iframe = await screen.findByTitle('Chicken and Rice video')
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/abc123')
    expect(screen.queryByText('No video attached, edit the meal to add one.')).not.toBeInTheDocument()
  })
})
