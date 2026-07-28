import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { resetMockAuth } from './mocks/firebaseAuth'
import { stubFetch } from './mocks/fetch'

vi.mock('firebase/auth', () => import('./mocks/firebaseAuth'))

beforeEach(() => {
  resetMockAuth()
  stubFetch()
})

afterEach(() => {
  cleanup()
})
