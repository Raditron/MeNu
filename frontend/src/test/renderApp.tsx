import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

/** Renders the app's route tree starting at `initialPath`, using a memory router. */
export function renderApp(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  )
}

export { mockAuthState, mockAuthLoading } from './mocks/firebaseAuth'
