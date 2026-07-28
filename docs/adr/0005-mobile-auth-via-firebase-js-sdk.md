# Mobile uses the firebase JS SDK, not @react-native-firebase

Web authenticates via the `firebase` JS SDK (`frontend/src/shared/firebase/firebase.ts`, `getAuth`, `onAuthStateChanged`). For mobile we considered `@react-native-firebase`, the native-module SDK more commonly reached for in production RN apps for its deeper native integration (push notifications, crashlytics, etc.). We chose to keep the `firebase` JS SDK instead — swapping `getAuth()` for `initializeAuth()` + `getReactNativePersistence(AsyncStorage)` is the only real difference — because it lets `useAuth`, `SessionProvider`/`SessionContext`, and the login/register/forgot/change-password hooks port from web almost verbatim, and there's no current requirement for native-only Firebase features that would justify the rewrite `@react-native-firebase`'s different API surface would demand.

## Consequences

- If a future feature needs a native-only Firebase capability, that's a real migration (different API, different auth-state plumbing), not a config change.
- Session/auth logic stays conceptually identical between web and mobile — a change to one Session model translates directly to the other.
