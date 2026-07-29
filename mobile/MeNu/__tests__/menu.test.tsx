import { screen, waitFor } from 'expo-router/testing-library';
import type { User } from 'firebase/auth';

import { renderApp } from '../test/renderApp';
import { mockAuthState } from '../test/mocks/firebaseAuth';

const fakeUser = { uid: 'test-uid', email: 'user@example.com' } as User;

function stubFetchWithMeals(meals: unknown[]) {
  globalThis.fetch = jest.fn(() =>
    Promise.resolve(
      new Response(JSON.stringify(meals), { status: 200, headers: { 'Content-Type': 'application/json' } }),
    ),
  ) as unknown as typeof fetch;
}

const backendMeal = {
  name: 'Chicken and Rice',
  meatType: { ingredient: { title: 'Chicken', caloriesPerGram: 2, icon: 'GiChicken' }, grams: 100 },
  sideType: { ingredient: { title: 'Rice', caloriesPerGram: 1, icon: 'GiRice' }, grams: 100 },
  cuisineStyles: [{ title: 'Italian' }],
  flavorProfiles: [{ title: 'Spicy' }],
};

describe('Menu tab', () => {
  it("lists the user's meals with portions, tags, and calorie total", async () => {
    mockAuthState(fakeUser);
    stubFetchWithMeals([backendMeal]);

    await renderApp('/');

    expect(await screen.findByText('Chicken and Rice')).toBeOnTheScreen();
    expect(screen.getByText('Chicken (100g) · Rice (100g)')).toBeOnTheScreen();
    expect(screen.getByText('Italian')).toBeOnTheScreen();
    expect(screen.getByText('Spicy')).toBeOnTheScreen();
    expect(screen.getByText('300 cal')).toBeOnTheScreen();
  });

  it('shows a "no meals yet" message for a user with zero meals', async () => {
    mockAuthState(fakeUser);
    stubFetchWithMeals([]);

    await renderApp('/');

    await waitFor(() => {
      expect(screen.getByText('No meals yet.')).toBeOnTheScreen();
    });
  });
});
