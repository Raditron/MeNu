# Client-side route protection via Firebase session, default-protected

Until now the app had no auth-state tracking at all — no `onAuthStateChanged` listener, no context, no guard — so any visitor could reach `/menu` or `/quiz` regardless of login state. We introduce a `Session` (React Context + `useAuth()` hook, subscribed once to Firebase's `onAuthStateChanged`) as the single source of truth for auth state, and a guard component wrapping the `AppLayout` route (rather than each protected route individually), so that Protected Routes are the default for anything nested under the app shell and new pages are protected without extra effort. `/login`, `/register`, `/forgot-password`, and `/change-password` are the explicit Public Route allowlist, kept outside `AppLayout`. We chose Context+hook over a module-level store because it's the standard, more discoverable pattern for a small app's first piece of shared state.

## Consequences

- A page that needs the app shell (`AppLayout`) is, by construction, also protected — there's no way to opt a shell-nested page out of protection without restructuring the route tree.
- `/change-password` and `/forgot-password` deliberately do not redirect an already-authenticated user away, since their flow is driven by an emailed `oobCode` independent of the current Session.
