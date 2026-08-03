import { fireEvent } from '@testing-library/react-native';
import { screen } from 'expo-router/testing-library';
import type { User } from 'firebase/auth';

import { renderApp } from '../test/renderApp';
import { mockAuthState } from '../test/mocks/firebaseAuth';

const fakeUser = { uid: 'test-uid', email: 'user@example.com' } as User;

const catalog = {
  meatTypes: [
    { title: 'Chicken', caloriesPerGram: 2, icon: 'GiChicken' },
    { title: 'Beef', caloriesPerGram: 3, icon: 'GiBeef' },
  ],
  sideTypes: [{ title: 'Rice', caloriesPerGram: 1, icon: 'GiRice' }],
  cuisineStyles: [{ title: 'Italian' }, { title: 'Mexican' }],
  flavorProfiles: [{ title: 'Spicy' }, { title: 'Savory' }],
};

const existingMeal = {
  id: 'meal-1',
  name: 'Chicken and Rice',
  meatType: { ingredient: catalog.meatTypes[0], grams: 100 },
  sideType: { ingredient: catalog.sideTypes[0], grams: 100 },
  cuisineStyles: [{ title: 'Italian' }],
  flavorProfiles: [{ title: 'Spicy' }],
};

function jsonResponse(body: unknown) {
  return Promise.resolve(
    new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } }),
  );
}

/** The backend stores/reads a portion by ingredient title, but always serves the meal with the full hydrated ingredient. */
function hydratePortion(portion: { ingredientTitle: string; grams: number }, options: { title: string }[]) {
  return { ingredient: options.find((option) => option.title === portion.ingredientTitle), grams: portion.grams };
}

/** Simulates the backend: an edit PUT mutates the in-memory meal returned by the meals GET. */
function stubFetchWithEditBackend(putSpy?: jest.Mock) {
  let meals: unknown[] = [existingMeal];
  globalThis.fetch = jest.fn((input: unknown, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/api/catalog')) return jsonResponse(catalog);
    if (url.endsWith('/meal') && init?.method === 'PUT') {
      const { meal } = JSON.parse(String(init.body));
      putSpy?.(meal);
      const hydratedMeal = {
        ...meal,
        meatType: hydratePortion(meal.meatType, catalog.meatTypes),
        sideType: hydratePortion(meal.sideType, catalog.sideTypes),
      };
      meals = meals.map((existing) => ((existing as { id: string }).id === meal.id ? hydratedMeal : existing));
      return jsonResponse({});
    }
    if (url.includes('/meals')) return jsonResponse(meals);
    return jsonResponse([]);
  }) as unknown as typeof fetch;
}

describe('Edit Meal screen', () => {
  it('is reachable from the Menu screen and renders pre-filled with the Meal\'s current fields', async () => {
    mockAuthState(fakeUser);
    stubFetchWithEditBackend();

    await renderApp('/');
    await fireEvent.press(await screen.findByTestId('meal-card-edit'));

    expect(await screen.findByDisplayValue('Chicken and Rice')).toBeOnTheScreen();
    expect(await screen.findByText('Total: 300 cal')).toBeOnTheScreen();
    expect(screen.getByTestId('edit-meal-submit').props.accessibilityState.disabled).toBe(false);
  });

  it('cannot be submitted once the name is cleared', async () => {
    mockAuthState(fakeUser);
    stubFetchWithEditBackend();

    await renderApp('/');
    await fireEvent.press(await screen.findByTestId('meal-card-edit'));

    await fireEvent.changeText(await screen.findByDisplayValue('Chicken and Rice'), '');

    expect(screen.getByTestId('edit-meal-submit').props.accessibilityState.disabled).toBe(true);
  });

  it('saving a change sends the edit request with the Meal id preserved, and the Menu reflects it on return', async () => {
    mockAuthState(fakeUser);
    const putSpy = jest.fn();
    stubFetchWithEditBackend(putSpy);

    await renderApp('/');
    await fireEvent.press(await screen.findByTestId('meal-card-edit'));

    const nameInput = await screen.findByDisplayValue('Chicken and Rice');
    await fireEvent.changeText(nameInput, 'Chicken and Rice, extra spicy');
    await fireEvent.press(screen.getByTestId('edit-meal-submit'));

    expect(await screen.findByText('Chicken and Rice, extra spicy')).toBeOnTheScreen();
    expect(putSpy).toHaveBeenCalledTimes(1);
    expect(putSpy.mock.calls[0][0]).toEqual({
      id: 'meal-1',
      name: 'Chicken and Rice, extra spicy',
      meatType: { ingredientTitle: 'Chicken', grams: 100 },
      sideType: { ingredientTitle: 'Rice', grams: 100 },
      cuisineStyles: [{ title: 'Italian' }],
      flavorProfiles: [{ title: 'Spicy' }],
    });
  });

  it('navigating back without saving leaves the Meal unchanged', async () => {
    mockAuthState(fakeUser);
    const putSpy = jest.fn();
    stubFetchWithEditBackend(putSpy);

    await renderApp('/');
    await fireEvent.press(await screen.findByTestId('meal-card-edit'));

    const nameInput = await screen.findByDisplayValue('Chicken and Rice');
    await fireEvent.changeText(nameInput, 'Something else entirely');
    await fireEvent.press(screen.getByTestId('edit-meal-cancel'));

    expect(await screen.findByText('Chicken and Rice')).toBeOnTheScreen();
    expect(putSpy).not.toHaveBeenCalled();
  });
});
