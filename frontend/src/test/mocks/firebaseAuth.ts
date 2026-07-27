import { vi } from 'vitest'
import type { User } from 'firebase/auth'

type AuthListener = (user: User | null) => void

let listeners: AuthListener[] = []
let currentUser: User | null = null
let resolved = true

/** Emits an authenticated (or signed-out, for `null`) session to every subscriber. */
export function mockAuthState(user: User | null) {
  currentUser = user
  resolved = true
  listeners.forEach((listener) => listener(currentUser))
}

/** Puts the mock into a "still resolving" state — subscribers are registered but never called. */
export function mockAuthLoading() {
  currentUser = null
  resolved = false
}

/** Resets the mock to a fresh, resolved-signed-out state. Call between tests. */
export function resetMockAuth() {
  listeners = []
  currentUser = null
  resolved = true
}

export const getAuth = vi.fn(() => ({}))

export const onAuthStateChanged = vi.fn((_auth: unknown, callback: AuthListener) => {
  listeners.push(callback)
  if (resolved) callback(currentUser)
  return () => {
    listeners = listeners.filter((listener) => listener !== callback)
  }
})

export const signOut = vi.fn(() => {
  mockAuthState(null)
  return Promise.resolve()
})

export const createUserWithEmailAndPassword = vi.fn()
export const signInWithEmailAndPassword = vi.fn()
export const sendPasswordResetEmail = vi.fn()
export const confirmPasswordReset = vi.fn()
