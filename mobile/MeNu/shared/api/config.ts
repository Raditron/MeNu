// Relative fetches resolve against the Metro dev server, not the backend, so an
// explicit origin is required on every platform (web, iOS, Android).
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';
