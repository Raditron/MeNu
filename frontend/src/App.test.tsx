import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { mockAuthLoading, mockAuthState, renderApp } from './test/renderApp'
import type { User } from 'firebase/auth'

const fakeUser = { uid: 'test-uid', email: 'user@example.com' } as User

describe('route tree', () => {
  it('renders the login form at /login', () => {
    renderApp('/login')

    expect(screen.getByRole('heading', { name: 'Log in' })).toBeInTheDocument()
  })

  it('redirects an unauthenticated visitor away from a protected route to /login', () => {
    mockAuthState(null)
    renderApp('/menu')

    expect(screen.getByRole('heading', { name: 'Log in' })).toBeInTheDocument()
  })

  it('renders protected page content for an authenticated visitor', () => {
    mockAuthState(fakeUser)
    renderApp('/menu')

    expect(screen.getByRole('heading', { name: 'Menu', level: 1 })).toBeInTheDocument()
  })

  it('shows a neutral blank state for a protected route while the session is still resolving', () => {
    mockAuthLoading()
    renderApp('/menu')

    expect(screen.queryByRole('heading', { name: 'Log in' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Menu', level: 1 })).not.toBeInTheDocument()
  })

  it.each(['/login', '/register', '/forgot-password', '/change-password'])(
    '%s renders normally for an unauthenticated visitor',
    (path) => {
      mockAuthState(null)
      renderApp(path)

      expect(document.body.textContent).not.toBe('')
    },
  )

  it.each(['/forgot-password', '/change-password'])('%s renders normally while the session is still resolving', (path) => {
    mockAuthLoading()
    renderApp(path)

    expect(document.body.textContent).not.toBe('')
  })

  it.each(['/login', '/register'])('redirects an authenticated visitor away from %s to /menu', (path) => {
    mockAuthState(fakeUser)
    renderApp(path)

    expect(screen.getByRole('heading', { name: 'Menu', level: 1 })).toBeInTheDocument()
  })

  it.each(['/forgot-password', '/change-password'])(
    '%s does not redirect an authenticated visitor away',
    (path) => {
      mockAuthState(fakeUser)
      renderApp(path)

      expect(screen.queryByRole('heading', { name: 'Menu', level: 1 })).not.toBeInTheDocument()
      expect(document.body.textContent).not.toBe('')
    },
  )

  it('signing out ends the session and bounces the next protected visit to /login', async () => {
    const user = userEvent.setup()
    mockAuthState(fakeUser)
    renderApp('/menu')

    await user.click(screen.getByRole('button', { name: 'Sign out' }))

    expect(await screen.findByRole('heading', { name: 'Log in' })).toBeInTheDocument()
  })
})
