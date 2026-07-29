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

/** Routes each fetch by whether the URL contains a given substring. */
function stubFetchByUrl(responses: Record<string, unknown>) {
  globalThis.fetch = jest.fn((input: unknown) => {
    const url = String(input);
    const match = Object.keys(responses).find((key) => url.includes(key));
    const body = match ? responses[match] : [];
    return Promise.resolve(
      new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } }),
    );
  }) as unknown as typeof fetch;
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
});
