# Shared domain package for frontend and mobile

Introducing the mobile app means two UI clients (`frontend/`, `mobile/MeNu`) now need the same Meal-facing types (`Meal`, `Portion`, `TagValue`, `IngredientTagValue`, `Category`, `Mood`, `Catalog`) and pure calculation utils (`calculateMatchScore`, `calculateCalories`). We extracted these into a new `packages/domain` workspace package, adopted npm workspaces at the repo root to wire it up, and migrated `frontend/` to import from it (removing its local copies) so there's exactly one source of truth rather than two copies drifting apart. `backend/`'s domain layer (`backend/src/meal/domain/value-objects/Meal.ts`, etc.) is deliberately excluded — it's a DDD entity with constructor invariants and methods, not a wire DTO, and already has its own separate `calculateMatchScore` for server-side scoring; folding it in would conflate two different concerns.

## Consequences

- The repo root now has npm workspaces (previously `frontend/`, `backend/`, and `mobile/MeNu` were three fully independent npm packages with no root `package.json`).
- Changing a shared type/util now requires considering both consumers (web and mobile) at once, rather than being scoped to one app.
- Frontend's `meal` types/utils moved out of `frontend/src/meal/types` and `frontend/src/meal/utils` into `packages/domain` — imports there change from relative paths to the package name.
