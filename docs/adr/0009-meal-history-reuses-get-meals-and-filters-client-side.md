# Meal History reuses GET /users/:uid/meals instead of a dedicated endpoint

Every Meal returned by the existing `GET /users/:uid/meals` already carries its own `eatenHistory` — the domain field is public and rides along in the JSON response even though no client types or reads it today. The Meal History page flattens every meal's `eatenHistory` into a single Eaten Entry feed and filters it client-side (name, date-range bucket, Category), the same way `MenuPage` already filters meals client-side via `useMeals` + `useMemo`. We considered adding a dedicated `GET /users/:uid/history` endpoint with server-side filtering, but rejected it: it would duplicate data already on the wire, and the dataset is small enough that client-side filtering is sufficient for now.

## Consequences

- No new backend route or application service for Meal History; `packages/domain`'s `Meal` type just needs `eatenHistory` added so clients can type what the API already sends.
- If the eaten-history dataset grows large enough that shipping every meal's full history on every meals fetch becomes wasteful, this decision should be revisited in favor of a paginated, server-filtered endpoint.
