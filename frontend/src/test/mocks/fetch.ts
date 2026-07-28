import { vi } from 'vitest'

/** Default stub for the global `fetch` used by route/render tests that don't care about network responses. */
export function stubFetch() {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    ),
  )
}
