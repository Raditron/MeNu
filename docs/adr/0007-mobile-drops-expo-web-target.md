# Mobile Expo app drops the web target

The Expo template ships building for web by default (`react-native-web`, `app/+html.tsx`, `app.json`'s `web` block, the `web` npm script). We disabled all of it — mobile targets iOS and Android only. `frontend/` is already a complete, separately-architected web app; leaving Expo's web output enabled would produce a second, differently-built web surface in the same repo for no purpose.

## Consequences

- `mobile/MeNu` cannot be run with `expo start --web`; there is exactly one web app in the repo (`frontend/`).
- If native-only APIs are used later that have no web shim, there's no web target to accidentally break.
