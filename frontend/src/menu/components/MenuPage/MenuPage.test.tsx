import { screen } from '@testing-library/react'
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
  sideTypes: [{ title: 'Rice', caloriesPerGram: 1, icon: 'GiRice' }],
  cuisineStyles: [{ title: 'Italian' }, { title: 'Mexican' }],
  flavorProfiles: [{ title: 'Spicy' }, { title: 'Savory' }],
}

const existingMeal = {
  id: 'meal-1',
  name: 'Chicken and Rice',
  meatType: { ingredient: catalog.meatTypes[0], grams: 100 },
  sideType: { ingredient: catalog.sideTypes[0], grams: 100 },
  cuisineStyles: [{ title: 'Italian' }],
  flavorProfiles: [{ title: 'Spicy' }],
}

function jsonResponse(body: unknown) {
  return Promise.resolve(
    new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } }),
  )
}

/** The backend stores/reads a portion by ingredient title, but always serves the meal with the full hydrated ingredient. */
function hydratePortion(
  portion: { ingredientTitle: string; grams: number },
  options: { title: string }[],
) {
  return { ingredient: options.find((option) => option.title === portion.ingredientTitle), grams: portion.grams }
}

/** Simulates the backend: an edit PUT mutates the in-memory meal returned by the meals GET. */
function stubFetchWithEditBackend(putSpy?: (body: { meal: unknown }) => void) {
  let meals: unknown[] = [existingMeal]
  vi.stubGlobal(
    'fetch',
    vi.fn((input: unknown, init?: RequestInit) => {
      const url = String(input)
      if (url.includes('/api/catalog')) return jsonResponse(catalog)
      if (url.endsWith('/meal') && init?.method === 'PUT') {
        const body = JSON.parse(String(init.body))
        putSpy?.(body)
        const hydratedMeal = {
          ...body.meal,
          meatType: hydratePortion(body.meal.meatType, catalog.meatTypes),
          sideType: hydratePortion(body.meal.sideType, catalog.sideTypes),
        }
        meals = meals.map((meal) => ((meal as { id: string }).id === body.meal.id ? hydratedMeal : meal))
        return jsonResponse({})
      }
      if (url.includes('/meals')) return jsonResponse(meals)
      return jsonResponse([])
    }),
  )
}

async function openEditModal() {
  const user = userEvent.setup()
  await user.click(await screen.findByRole('button', { name: 'Edit meal' }))
  return user
}

describe('Editing a Meal on the Menu', () => {
  it("opens a modal pre-filled with the Meal's current fields", async () => {
    mockAuthState(fakeUser)
    stubFetchWithEditBackend()
    renderApp('/menu')

    await openEditModal()

    expect(screen.getByRole('heading', { name: 'Edit Meal' })).toBeInTheDocument()
    expect(screen.getByLabelText('Meal name')).toHaveValue('Chicken and Rice')
    expect(screen.getByLabelText('Meat Type')).toHaveValue('Chicken')
    expect(screen.getByLabelText('Side Type')).toHaveValue('Rice')
    expect(screen.getByText((_, element) => element?.textContent === 'Total: 300 cal')).toBeInTheDocument()
  })

  it('cannot be submitted once the name is cleared', async () => {
    mockAuthState(fakeUser)
    stubFetchWithEditBackend()
    renderApp('/menu')

    const user = await openEditModal()
    await user.clear(screen.getByLabelText('Meal name'))

    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeDisabled()
  })

  it('saving a change sends the edit request with the Meal id preserved, then reflects the change in the Menu', async () => {
    mockAuthState(fakeUser)
    const putSpy = vi.fn()
    stubFetchWithEditBackend(putSpy)
    renderApp('/menu')

    const user = await openEditModal()
    const nameInput = screen.getByLabelText('Meal name')
    await user.clear(nameInput)
    await user.type(nameInput, 'Chicken and Rice, extra spicy')
    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(await screen.findByText('Chicken and Rice, extra spicy')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Edit Meal' })).not.toBeInTheDocument()
    expect(putSpy).toHaveBeenCalledTimes(1)
    expect(putSpy.mock.calls[0][0]).toEqual({
      meal: {
        id: 'meal-1',
        name: 'Chicken and Rice, extra spicy',
        meatType: { ingredientTitle: 'Chicken', grams: 100 },
        sideType: { ingredientTitle: 'Rice', grams: 100 },
        cuisineStyles: [{ title: 'Italian' }],
        flavorProfiles: [{ title: 'Spicy' }],
      },
    })
  })

  it('canceling discards the in-progress edit and leaves the Meal untouched', async () => {
    mockAuthState(fakeUser)
    const putSpy = vi.fn()
    stubFetchWithEditBackend(putSpy)
    renderApp('/menu')

    const user = await openEditModal()
    const nameInput = screen.getByLabelText('Meal name')
    await user.clear(nameInput)
    await user.type(nameInput, 'Something else entirely')
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('heading', { name: 'Edit Meal' })).not.toBeInTheDocument()
    expect(screen.getByText('Chicken and Rice')).toBeInTheDocument()
    expect(putSpy).not.toHaveBeenCalled()
  })
})
