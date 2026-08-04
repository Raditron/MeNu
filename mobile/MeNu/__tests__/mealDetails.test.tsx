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
  globalThis.fetch = jest.fn((input: unknown, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/api/catalog')) return jsonResponse(catalog);
    if (/\/eat$/.test(url) && init?.method === 'POST') {
      return Promise.resolve(new Response(null, { status: 204 }));
    }
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

  it('marks the meal as eaten and shows confirmation when the button is pressed', async () => {
    mockAuthState(fakeUser);
    stubFetchWithMealById(existingMeal);

    await renderApp('/meal/meal-1');
    await fireEvent.press(await screen.findByTestId('mark-eaten-button'));

    expect(await screen.findByText('Marked as eaten ✓')).toBeOnTheScreen();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/users/test-uid/meal/meal-1/eat'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('allows marking the same meal as eaten more than once', async () => {
    mockAuthState(fakeUser);
    stubFetchWithMealById(existingMeal);

    await renderApp('/meal/meal-1');
    const eatButton = await screen.findByTestId('mark-eaten-button');
    await fireEvent.press(eatButton);
    await screen.findByText('Marked as eaten ✓');
    await fireEvent.press(eatButton);
    await screen.findByText('Marked as eaten ✓');

    const eatCalls = (fetch as unknown as jest.Mock).mock.calls.filter(([input]: [unknown]) =>
      String(input).endsWith('/eat'),
    );
    expect(eatCalls).toHaveLength(2);
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
