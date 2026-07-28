import type { User } from 'firebase/auth';

type AuthListener = (user: User | null) => void;

let listeners: AuthListener[] = [];
let currentUser: User | null = null;
let resolved = true;

/** Emits an authenticated (or signed-out, for `null`) session to every subscriber. */
export function mockAuthState(user: User | null) {
  currentUser = user;
  resolved = true;
  listeners.forEach((listener) => listener(currentUser));
}

/** Puts the mock into a "still resolving" state — subscribers are registered but never called. */
export function mockAuthLoading() {
  currentUser = null;
  resolved = false;
}

/** Resets the mock to a fresh, resolved-signed-out state. Call between tests. */
export function resetMockAuth() {
  listeners = [];
  currentUser = null;
  resolved = true;
}

export const initializeAuth = jest.fn(() => ({}));
export const getReactNativePersistence = jest.fn(() => ({}));

export const onAuthStateChanged = jest.fn((_auth: unknown, callback: AuthListener) => {
  listeners.push(callback);
  if (resolved) callback(currentUser);
  return () => {
    listeners = listeners.filter((listener) => listener !== callback);
  };
});

export const signOut = jest.fn(() => {
  mockAuthState(null);
  return Promise.resolve();
});

export const createUserWithEmailAndPassword = jest.fn();
export const signInWithEmailAndPassword = jest.fn();
export const sendPasswordResetEmail = jest.fn();
export const confirmPasswordReset = jest.fn();
