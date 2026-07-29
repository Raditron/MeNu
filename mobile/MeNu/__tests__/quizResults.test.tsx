import { act, fireEvent } from '@testing-library/react-native';
import { screen } from 'expo-router/testing-library';
import type { User } from 'firebase/auth';

import { renderApp } from '../test/renderApp';
import { mockAuthState } from '../test/mocks/firebaseAuth';

const fakeUser = { uid: 'test-uid', email: 'user@example.com' } as User;

const catalog = {
  meatTypes: [
    { title: 'Chicken', caloriesPerGram: 2, icon: 'GiChicken' },
    { title: 'Beef', caloriesPerGram: 3, icon: 'GiCow' },
  ],
  sideTypes: [
    { title: 'Rice', caloriesPerGram: 1, icon: 'GiRice' },
    { title: 'Pasta', caloriesPerGram: 1.5, icon: 'GiPasta' },
  ],
  cuisineStyles: [{ title: 'Italian' }, { title: 'Asian' }],
  flavorProfiles: [{ title: 'Spicy' }, { title: 'Sweet' }],
};

const chickenMeal = {
  name: 'Chicken and Rice',
  meatType: { ingredient: { title: 'Chicken', caloriesPerGram: 2, icon: 'GiChicken' }, grams: 100 },
  sideType: { ingredient: { title: 'Rice', caloriesPerGram: 1, icon: 'GiRice' }, grams: 100 },
  cuisineStyles: [{ title: 'Italian' }],
  flavorProfiles: [{ title: 'Spicy' }],
};

const beefMeal = {
  name: 'Beef and Pasta',
  meatType: { ingredient: { title: 'Beef', caloriesPerGram: 3, icon: 'GiCow' }, grams: 150 },
  sideType: { ingredient: { title: 'Pasta', caloriesPerGram: 1.5, icon: 'GiPasta' }, grams: 100 },
  cuisineStyles: [{ title: 'Asian' }],
  flavorProfiles: [{ title: 'Sweet' }],
};

function jsonResponse(body: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }),
  );
}

function stubFetchByUrl(responses: Record<string, unknown>) {
  globalThis.fetch = jest.fn((input: unknown) => {
    const url = String(input);
    const match = Object.keys(responses).find((key) => url.includes(key));
    return jsonResponse(match ? responses[match] : []);
  }) as unknown as typeof fetch;
}

async function completeQuiz() {
  await fireEvent.press(await screen.findByTestId('Meat Type-option-Chicken'));
  await fireEvent.press(await screen.findByTestId('Side Type-option-Rice'));
  await fireEvent.press(await screen.findByTestId('Cuisine Style-option-Italian'));
  await fireEvent.press(screen.getByTestId('quiz-next'));
  await screen.findByText('Flavor Profile');
  await fireEvent.press(screen.getByTestId('Flavor Profile-option-Spicy'));
  await fireEvent.press(screen.getByTestId('quiz-next'));
}

describe('Quiz results', () => {
  it('shows every meal ranked by match score as a percentage', async () => {
    mockAuthState(fakeUser);
    stubFetchByUrl({ '/api/catalog': catalog, '/quiz': { meals: [beefMeal, chickenMeal] } });

    await renderApp('/quiz');
    await completeQuiz();

    expect(await screen.findByText('Your matches')).toBeOnTheScreen();
    expect(screen.getByText('Chicken and Rice')).toBeOnTheScreen();
    expect(screen.getByText('Beef and Pasta')).toBeOnTheScreen();
    expect(screen.getByText('100% match')).toBeOnTheScreen();
    expect(screen.getByText('0% match')).toBeOnTheScreen();
  });

  it('shows a loading state while matching is in progress', async () => {
    mockAuthState(fakeUser);
    let resolveQuiz: (value: Response) => void;
    globalThis.fetch = jest.fn((input: unknown) => {
      const url = String(input);
      if (url.includes('/quiz')) {
        return new Promise<Response>((resolve) => {
          resolveQuiz = resolve;
        });
      }
      if (url.includes('/api/catalog')) return jsonResponse(catalog);
      return jsonResponse([]);
    }) as unknown as typeof fetch;

    await renderApp('/quiz');
    await completeQuiz();

    expect(screen.getByText('Finding your matches…')).toBeOnTheScreen();

    await act(async () => {
      resolveQuiz(
        new Response(JSON.stringify({ meals: [chickenMeal] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    });

    expect(await screen.findByText('Your matches')).toBeOnTheScreen();
  });

  it('shows a clear error state if matching fails', async () => {
    mockAuthState(fakeUser);
    globalThis.fetch = jest.fn((input: unknown) => {
      const url = String(input);
      if (url.includes('/quiz')) return jsonResponse({ error: 'boom' }, 500);
      if (url.includes('/api/catalog')) return jsonResponse(catalog);
      return jsonResponse([]);
    }) as unknown as typeof fetch;

    await renderApp('/quiz');
    await completeQuiz();

    expect(await screen.findByText('Something went wrong finding your matches. Please try again.')).toBeOnTheScreen();
  });

  it('retake quiz resets the wizard to the first question', async () => {
    mockAuthState(fakeUser);
    stubFetchByUrl({ '/api/catalog': catalog, '/quiz': { meals: [chickenMeal] } });

    await renderApp('/quiz');
    await completeQuiz();
    await screen.findByText('Your matches');

    await fireEvent.press(screen.getByTestId('quiz-retake'));

    expect(await screen.findByText('Meat Type')).toBeOnTheScreen();
    expect(screen.getByText('Step 1 of 4')).toBeOnTheScreen();
  });
});
