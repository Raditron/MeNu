# Meal details lookup is user-scoped, and web/mobile use different route shapes

`GET /api/users/:uid/meal/:mealId` returns a single Meal, nested under the owning user rather than exposed as a top-level `/api/meals/:mealId` resource. Meals aren't their own Mongo collection — they live inside `User.menu.meals[]` — and this mirrors the existing `addMeal`/`editMeal`/`getMeals` endpoints, which are all nested the same way. Scoping the lookup to `:uid` also means a meal id that belongs to another user, or no longer exists, naturally resolves to "not found" rather than needing a separate ownership check: the meal is only ever looked up inside that user's own menu.

The web details page uses `/menu/:mealId`, nested under the existing `/menu` route. Mobile uses `/meal/[id]` instead of mirroring that string, because the mobile home tab lives at `(tabs)/index.tsx`, which Expo Router resolves to path `/` — there is no literal `/menu` path on mobile to nest under. Both clients call the same backend endpoint; only the client-side URL shape differs, for reasons specific to each router.

## Consequences

- A meal can only ever be fetched through its owner's uid; there is no cross-user or catalog-wide meal lookup endpoint.
- Web and mobile deep links to the same meal use different URL shapes (`/menu/:mealId` vs `/meal/:id`) and are not interchangeable.
