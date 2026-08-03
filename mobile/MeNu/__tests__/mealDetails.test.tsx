import { fireEvent } from '@testing-library/react-native';
import { screen } from 'expo-router/testing-library';
import type { User } from 'firebase/auth';

import { renderApp } from '../test/renderApp';
import { mockAuthState } from '../test/mocks/firebaseAuth';

const fakeUser = { uid: 'test-uid', email: 'user@example.com' } as User;

const catalog = {
  meatTypes: [{ title: 'Chicken', caloriesPerGram: 2, icon: 'GiChicken' }],
  sideTypes: [{ title: 'Rice', caloriesPerGram: 1, icon: 'GiRice' }],
  cuisineStyles: [{ title: 'Italian' }],
  flavorProfiles: [{ title: 'Spicy' }],
};

const existingMeal = {
  id: 'meal-1',
  name: 'Chicken and Rice',
  meatType: { ingredient: catalog.meatTypes[0], grams: 100 },
  sideType: { ingredient: catalog.sideTypes[0], grams: 100 },
  cuisineStyles: [{ title: 'Italian' }],
  flavorProfiles: [{ title: 'Spicy' }],
};

function jsonResponse(body: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }),
  );
}

function stubFetchWithMealById(meal: unknown | null) {
  globalThis.fetch = jest.fn((input: unknown) => {
    const url = String(input);
    if (url.includes('/api/catalog')) return jsonResponse(catalog);
    if (/\/meal\/[^/]+$/.test(url)) {
      return meal ? jsonResponse(meal) : jsonResponse({ error: 'Meal not found' }, 404);
    }
    if (url.includes('/meals')) return jsonResponse([existingMeal]);
    return jsonResponse([]);
  }) as unknown as typeof fetch;
}

describe('Meal details screen', () => {
  it('is reachable by tapping a meal card on the Menu tab and shows the expected content', async () => {
    mockAuthState(fakeUser);
    stubFetchWithMealById(existingMeal);

    await renderApp('/');
    await fireEvent.press(await screen.findByTestId('meal-card'));

    expect(await screen.findByText('Chicken and Rice')).toBeOnTheScreen();
    expect(screen.getByText('Chicken (100g) · Rice (100g)')).toBeOnTheScreen();
    expect(screen.getByText('Italian')).toBeOnTheScreen();
    expect(screen.getByText('Spicy')).toBeOnTheScreen();
    expect(screen.getByText('300 cal')).toBeOnTheScreen();
  });

  it('shows a "meal not found" message with a way back when the id does not resolve', async () => {
    mockAuthState(fakeUser);
    stubFetchWithMealById(null);

    await renderApp('/meal/does-not-exist');

    expect(await screen.findByText('Meal not found.')).toBeOnTheScreen();
    expect(screen.getByTestId('meal-details-back')).toBeOnTheScreen();
  });

  it('tapping the edit control opens Edit Meal instead of navigating to the details screen', async () => {
    mockAuthState(fakeUser);
    stubFetchWithMealById(existingMeal);

    await renderApp('/');
    await fireEvent.press(await screen.findByTestId('meal-card-edit'));

    expect(await screen.findByDisplayValue('Chicken and Rice')).toBeOnTheScreen();
    expect(screen.getByText('Total: 300 cal')).toBeOnTheScreen();
    expect(screen.queryByTestId('meal-details-back')).not.toBeOnTheScreen();
  });

  it('shows a fallback message when the meal has no video attached', async () => {
    mockAuthState(fakeUser);
    stubFetchWithMealById(existingMeal);

    await renderApp('/meal/meal-1');

    expect(await screen.findByText('No video attached, edit the meal to add one.')).toBeOnTheScreen();
    expect(screen.queryByTestId('meal-video')).not.toBeOnTheScreen();
  });

  it('embeds the YouTube video when the meal has a youtubeURL', async () => {
    mockAuthState(fakeUser);
    stubFetchWithMealById({ ...existingMeal, youtubeURL: 'https://www.youtube.com/watch?v=abc123' });

    await renderApp('/meal/meal-1');

    expect(await screen.findByTestId('meal-video')).toBeOnTheScreen();
    expect(screen.getByTestId('meal-video').props.source).toEqual({ uri: 'https://www.youtube.com/embed/abc123' });
    expect(screen.queryByText('No video attached, edit the meal to add one.')).not.toBeOnTheScreen();
  });
});
