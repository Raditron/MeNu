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

function jsonResponse(body: unknown) {
  return Promise.resolve(
    new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } }),
  );
}

function stubFetchByUrl(responses: Record<string, unknown>) {
  globalThis.fetch = jest.fn((input: unknown) => {
    const url = String(input);
    const match = Object.keys(responses).find((key) => url.includes(key));
    return jsonResponse(match ? responses[match] : []);
  }) as unknown as typeof fetch;
}

describe('Quiz wizard single-select steps', () => {
  it('shows a loading state until the catalog arrives, then the first step', async () => {
    mockAuthState(fakeUser);
    let resolveFetch: (value: Response) => void;
    globalThis.fetch = jest.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    ) as unknown as typeof fetch;

    await renderApp('/quiz');

    expect(screen.getByText('Loading quiz…')).toBeOnTheScreen();

    await act(async () => {
      resolveFetch(
        new Response(JSON.stringify(catalog), { status: 200, headers: { 'Content-Type': 'application/json' } }),
      );
    });

    expect(await screen.findByText('Meat Type')).toBeOnTheScreen();
    expect(screen.getByText('Step 1 of 4')).toBeOnTheScreen();
  });

  it('renders Meat Type as a single-select step and immediately advances to Side Type on pick', async () => {
    mockAuthState(fakeUser);
    stubFetchByUrl({ '/api/catalog': catalog });

    await renderApp('/quiz');

    expect(await screen.findByText('Meat Type')).toBeOnTheScreen();
    expect(screen.getByText('Step 1 of 4')).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('Meat Type-option-Chicken'));

    expect(await screen.findByText('Side Type')).toBeOnTheScreen();
    expect(screen.getByText('Step 2 of 4')).toBeOnTheScreen();
    expect(screen.queryByText('Meat Type')).not.toBeOnTheScreen();
  });

  it('advances into Cuisine Style once both single-select steps are picked', async () => {
    mockAuthState(fakeUser);
    stubFetchByUrl({ '/api/catalog': catalog });

    await renderApp('/quiz');

    await fireEvent.press(await screen.findByTestId('Meat Type-option-Chicken'));
    await fireEvent.press(await screen.findByTestId('Side Type-option-Rice'));

    expect(await screen.findByText('Cuisine Style')).toBeOnTheScreen();
    expect(screen.getByText('Step 3 of 4')).toBeOnTheScreen();
  });
});

async function advanceToCuisineStyle() {
  await fireEvent.press(await screen.findByTestId('Meat Type-option-Chicken'));
  await fireEvent.press(await screen.findByTestId('Side Type-option-Rice'));
  await screen.findByText('Cuisine Style');
}

describe('Quiz wizard multi-select steps', () => {
  it('allows picking more than one option and keeps Next disabled until one is picked', async () => {
    mockAuthState(fakeUser);
    stubFetchByUrl({ '/api/catalog': catalog });

    await renderApp('/quiz');
    await advanceToCuisineStyle();

    expect(screen.getByTestId('quiz-next').props.accessibilityState.disabled).toBe(true);

    await fireEvent.press(screen.getByTestId('Cuisine Style-option-Italian'));
    expect(screen.getByTestId('quiz-next').props.accessibilityState.disabled).toBe(false);

    await fireEvent.press(screen.getByTestId('Cuisine Style-option-Asian'));
    expect(screen.getByText('Cuisine Style')).toBeOnTheScreen();
    expect(screen.getByTestId('Cuisine Style-option-Italian').props.accessibilityState.selected).toBe(true);
    expect(screen.getByTestId('Cuisine Style-option-Asian').props.accessibilityState.selected).toBe(true);
  });

  it('stays on the multi-select step until Next is explicitly tapped', async () => {
    mockAuthState(fakeUser);
    stubFetchByUrl({ '/api/catalog': catalog });

    await renderApp('/quiz');
    await advanceToCuisineStyle();

    await fireEvent.press(screen.getByTestId('Cuisine Style-option-Italian'));
    expect(screen.getByText('Cuisine Style')).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('quiz-next'));
    expect(await screen.findByText('Flavor Profile')).toBeOnTheScreen();
    expect(screen.getByText('Step 4 of 4')).toBeOnTheScreen();
  });
});

describe('Quiz wizard back navigation', () => {
  it('has no Back action on the first question', async () => {
    mockAuthState(fakeUser);
    stubFetchByUrl({ '/api/catalog': catalog });

    await renderApp('/quiz');
    await screen.findByText('Meat Type');

    expect(screen.queryByTestId('quiz-back')).toBeNull();
  });

  it('returns to the previous single-select question with its prior answer still selected and editable', async () => {
    mockAuthState(fakeUser);
    stubFetchByUrl({ '/api/catalog': catalog });

    await renderApp('/quiz');
    await advanceToCuisineStyle();

    await fireEvent.press(screen.getByTestId('quiz-back'));
    expect(await screen.findByText('Side Type')).toBeOnTheScreen();
    expect(screen.getByTestId('Side Type-option-Rice').props.accessibilityState.selected).toBe(true);

    await fireEvent.press(screen.getByTestId('Side Type-option-Pasta'));
    expect(await screen.findByText('Cuisine Style')).toBeOnTheScreen();
  });

  it('returns from a multi-select question to the previous one without losing its selections', async () => {
    mockAuthState(fakeUser);
    stubFetchByUrl({ '/api/catalog': catalog });

    await renderApp('/quiz');
    await advanceToCuisineStyle();
    await fireEvent.press(screen.getByTestId('Cuisine Style-option-Italian'));
    await fireEvent.press(screen.getByTestId('quiz-next'));

    await screen.findByText('Flavor Profile');
    await fireEvent.press(screen.getByTestId('quiz-back'));

    expect(await screen.findByText('Cuisine Style')).toBeOnTheScreen();
    expect(screen.getByTestId('Cuisine Style-option-Italian').props.accessibilityState.selected).toBe(true);
    expect(screen.getByTestId('quiz-next').props.accessibilityState.disabled).toBe(false);
  });
});
