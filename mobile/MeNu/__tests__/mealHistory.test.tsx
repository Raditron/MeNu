import { fireEvent, waitFor, within } from '@testing-library/react-native';
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
  sideTypes: [
    { title: 'Rice', caloriesPerGram: 1, icon: 'GiRice' },
    { title: 'Tortilla', caloriesPerGram: 1, icon: 'GiTortilla' },
  ],
  cuisineStyles: [{ title: 'Italian' }, { title: 'Mexican' }],
  flavorProfiles: [{ title: 'Spicy' }, { title: 'Savory' }],
};

const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

const chickenAndRice = {
  id: 'meal-1',
  name: 'Chicken and Rice',
  meatType: { ingredient: catalog.meatTypes[0], grams: 100 },
  sideType: { ingredient: catalog.sideTypes[0], grams: 100 },
  cuisineStyles: [{ title: 'Italian' }],
  flavorProfiles: [{ title: 'Spicy' }],
  eatenHistory: [{ date: daysAgo(1) }, { date: daysAgo(10) }],
};

const beefTacos = {
  id: 'meal-2',
  name: 'Beef Tacos',
  meatType: { ingredient: catalog.meatTypes[1], grams: 120 },
  sideType: { ingredient: catalog.sideTypes[1], grams: 80 },
  cuisineStyles: [{ title: 'Mexican' }],
  flavorProfiles: [{ title: 'Savory' }],
  eatenHistory: [{ date: daysAgo(40) }],
};

function jsonResponse(body: unknown) {
  return Promise.resolve(
    new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } }),
  );
}

function stubFetchWithMeals(meals: ({ id: string } & Record<string, unknown>)[]) {
  globalThis.fetch = jest.fn((input: unknown) => {
    const url = String(input);
    if (url.includes('/api/catalog')) return jsonResponse(catalog);
    if (url.includes('/meals')) return jsonResponse(meals);
    const mealIdMatch = /\/meal\/([^/]+)$/.exec(url);
    if (mealIdMatch) {
      const meal = meals.find((candidate) => candidate.id === mealIdMatch[1]);
      return meal ? jsonResponse(meal) : jsonResponse({ error: 'Meal not found' });
    }
    return jsonResponse([]);
  }) as unknown as typeof fetch;
}

async function findHistoryEntries() {
  return waitFor(() => screen.getAllByTestId('meal-history-entry'));
}

describe('Meal History tab', () => {
  it('lists every eaten entry newest-first with the meal name and date', async () => {
    mockAuthState(fakeUser);
    stubFetchWithMeals([chickenAndRice, beefTacos]);

    await renderApp('/history');

    const entries = await findHistoryEntries();
    expect(entries).toHaveLength(3);
    expect(within(entries[0]).getByText('Chicken and Rice')).toBeOnTheScreen();
    expect(within(entries[1]).getByText('Chicken and Rice')).toBeOnTheScreen();
    expect(within(entries[2]).getByText('Beef Tacos')).toBeOnTheScreen();
  });

  it('filters entries by meal name', async () => {
    mockAuthState(fakeUser);
    stubFetchWithMeals([chickenAndRice, beefTacos]);

    await renderApp('/history');
    await findHistoryEntries();
    await fireEvent.changeText(screen.getByTestId('meal-search-input'), 'beef');

    const entries = await waitFor(() => screen.getAllByTestId('meal-history-entry'));
    expect(entries).toHaveLength(1);
    expect(within(entries[0]).getByText('Beef Tacos')).toBeOnTheScreen();
  });

  it('filters entries by a preset date range', async () => {
    mockAuthState(fakeUser);
    stubFetchWithMeals([chickenAndRice, beefTacos]);

    await renderApp('/history');
    await findHistoryEntries();
    await fireEvent.press(screen.getByTestId('date-range-last7Days'));

    const entries = await waitFor(() => screen.getAllByTestId('meal-history-entry'));
    expect(entries).toHaveLength(1);
    expect(within(entries[0]).getByText('Chicken and Rice')).toBeOnTheScreen();
  });

  it('filters entries by category', async () => {
    mockAuthState(fakeUser);
    stubFetchWithMeals([chickenAndRice, beefTacos]);

    await renderApp('/history');
    await findHistoryEntries();
    await fireEvent.press(screen.getByTestId('Cuisine Style-option-Mexican'));

    const entries = await waitFor(() => screen.getAllByTestId('meal-history-entry'));
    expect(entries).toHaveLength(1);
    expect(within(entries[0]).getByText('Beef Tacos')).toBeOnTheScreen();
  });

  it('combines multiple filters', async () => {
    mockAuthState(fakeUser);
    stubFetchWithMeals([chickenAndRice, beefTacos]);

    await renderApp('/history');
    await findHistoryEntries();
    await fireEvent.press(screen.getByTestId('date-range-last30Days'));
    await fireEvent.press(screen.getByTestId('Cuisine Style-option-Mexican'));

    expect(await screen.findByText('No meal history matches your filters.')).toBeOnTheScreen();
  });

  it('clears active filters and shows the full history again', async () => {
    mockAuthState(fakeUser);
    stubFetchWithMeals([chickenAndRice, beefTacos]);

    await renderApp('/history');
    await findHistoryEntries();
    await fireEvent.press(screen.getByTestId('Cuisine Style-option-Mexican'));
    await waitFor(() => expect(screen.getAllByTestId('meal-history-entry')).toHaveLength(1));

    await fireEvent.press(screen.getByTestId('clear-filters-button'));

    await waitFor(() => expect(screen.getAllByTestId('meal-history-entry')).toHaveLength(3));
  });

  it('shows an empty state when nothing has been eaten yet', async () => {
    mockAuthState(fakeUser);
    stubFetchWithMeals([{ ...chickenAndRice, eatenHistory: [] }]);

    await renderApp('/history');

    expect(await screen.findByText('No meal history yet.')).toBeOnTheScreen();
  });

  it('shows a distinct empty state when filters match nothing', async () => {
    mockAuthState(fakeUser);
    stubFetchWithMeals([chickenAndRice]);

    await renderApp('/history');
    await findHistoryEntries();
    await fireEvent.changeText(screen.getByTestId('meal-search-input'), 'nonexistent meal');

    expect(await screen.findByText('No meal history matches your filters.')).toBeOnTheScreen();
  });

  it('navigates to the meal details screen when an entry is pressed', async () => {
    mockAuthState(fakeUser);
    stubFetchWithMeals([beefTacos]);

    await renderApp('/history');
    const entries = await findHistoryEntries();
    await fireEvent.press(entries[0]);

    expect(await screen.findByText('Beef Tacos')).toBeOnTheScreen();
    expect(screen.getByText('Beef (120g) · Tortilla (80g)')).toBeOnTheScreen();
  });
});
