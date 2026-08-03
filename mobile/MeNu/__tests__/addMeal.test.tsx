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

function jsonResponse(body: unknown) {
  return Promise.resolve(
    new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } }),
  );
}

/** Routes each fetch by whether the URL contains a given substring. */
function stubFetchByUrl(responses: Record<string, unknown>) {
  globalThis.fetch = jest.fn((input: unknown) => {
    const url = String(input);
    const match = Object.keys(responses).find((key) => url.includes(key));
    return jsonResponse(match ? responses[match] : []);
  }) as unknown as typeof fetch;
}

/** The backend stores/reads a portion by ingredient title, but always serves the meal with the full hydrated ingredient. */
function hydratePortion(portion: { ingredientTitle: string; grams: number }, options: { title: string }[]) {
  return { ingredient: options.find((option) => option.title === portion.ingredientTitle), grams: portion.grams };
}

/** Simulates the backend: POSTed meals are appended and returned by the meals GET. */
function stubFetchWithBackend(postSpy?: jest.Mock) {
  let meals: unknown[] = [];
  globalThis.fetch = jest.fn((input: unknown, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('/api/catalog')) return jsonResponse(catalog);
    if (url.endsWith('/meal') && init?.method === 'POST') {
      postSpy?.();
      const { meal } = JSON.parse(String(init.body));
      const hydratedMeal = {
        ...meal,
        meatType: hydratePortion(meal.meatType, catalog.meatTypes),
        sideType: hydratePortion(meal.sideType, catalog.sideTypes),
      };
      meals = [...meals, hydratedMeal];
      return jsonResponse({});
    }
    if (url.includes('/meals')) return jsonResponse(meals);
    return jsonResponse([]);
  }) as unknown as typeof fetch;
}

async function fillValidForm() {
  await fireEvent.changeText(await screen.findByPlaceholderText('Meal name'), 'Chicken and Rice');
  await fireEvent.press(screen.getByTestId('Meat Type-option-Chicken'));
  await fireEvent.changeText(screen.getByTestId('Meat Type-grams'), '100');
  await fireEvent.press(screen.getByTestId('Side Type-option-Rice'));
  await fireEvent.changeText(screen.getByTestId('Side Type-grams'), '100');
  await fireEvent.press(screen.getByTestId('Cuisine Style-option-Italian'));
  await fireEvent.press(screen.getByTestId('Flavor Profile-option-Spicy'));
}

describe('Add Meal form', () => {
  it('is reachable from the Menu screen', async () => {
    mockAuthState(fakeUser);
    stubFetchByUrl({ '/api/catalog': catalog, '/api/users': [] });

    await renderApp('/');

    await fireEvent.press(await screen.findByTestId('add-meal-button'));

    expect(await screen.findByPlaceholderText('Meal name')).toBeOnTheScreen();
  });

  it('updates a live calorie total as Meat/Side Type and grams are picked', async () => {
    mockAuthState(fakeUser);
    stubFetchByUrl({ '/api/catalog': catalog });

    await renderApp('/add-meal');

    await fireEvent.press(await screen.findByTestId('Meat Type-option-Chicken'));
    await fireEvent.changeText(screen.getByTestId('Meat Type-grams'), '100');
    await fireEvent.press(screen.getByTestId('Side Type-option-Rice'));
    await fireEvent.changeText(screen.getByTestId('Side Type-grams'), '100');

    expect(await screen.findByText('Total: 300 cal')).toBeOnTheScreen();
  });

  it('keeps submit disabled until name, portions, cuisine, and flavor are all set, then enables it', async () => {
    mockAuthState(fakeUser);
    stubFetchByUrl({ '/api/catalog': catalog });

    await renderApp('/add-meal');

    await screen.findByTestId('Meat Type-option-Chicken');
    expect(screen.getByTestId('add-meal-submit').props.accessibilityState.disabled).toBe(true);

    await fireEvent.changeText(screen.getByPlaceholderText('Meal name'), 'Chicken and Rice');
    await fireEvent.press(screen.getByTestId('Meat Type-option-Chicken'));
    await fireEvent.changeText(screen.getByTestId('Meat Type-grams'), '100');
    await fireEvent.press(screen.getByTestId('Side Type-option-Rice'));
    await fireEvent.changeText(screen.getByTestId('Side Type-grams'), '100');

    expect(screen.getByTestId('add-meal-submit').props.accessibilityState.disabled).toBe(true);

    await fireEvent.press(screen.getByTestId('Cuisine Style-option-Italian'));
    expect(screen.getByTestId('add-meal-submit').props.accessibilityState.disabled).toBe(true);

    await fireEvent.press(screen.getByTestId('Flavor Profile-option-Spicy'));
    expect(screen.getByTestId('add-meal-submit').props.accessibilityState.disabled).toBe(false);
  });

  it('submitting a valid form saves the meal and the Menu list shows it immediately', async () => {
    mockAuthState(fakeUser);
    stubFetchWithBackend();

    await renderApp('/');

    await fireEvent.press(await screen.findByTestId('add-meal-button'));
    await fillValidForm();

    await fireEvent.press(screen.getByTestId('add-meal-submit'));

    expect(await screen.findByText('Chicken and Rice')).toBeOnTheScreen();
    expect(screen.queryByPlaceholderText('Meal name')).not.toBeOnTheScreen();
  });

  it('cancel discards the in-progress form and returns to Menu with no meal saved', async () => {
    mockAuthState(fakeUser);
    const postSpy = jest.fn();
    stubFetchWithBackend(postSpy);

    await renderApp('/');

    await fireEvent.press(await screen.findByTestId('add-meal-button'));
    await fillValidForm();

    await fireEvent.press(screen.getByTestId('add-meal-cancel'));

    expect(await screen.findByText('No meals yet.')).toBeOnTheScreen();
    expect(postSpy).not.toHaveBeenCalled();
  });
});
