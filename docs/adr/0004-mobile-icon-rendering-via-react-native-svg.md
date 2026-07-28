# Mobile renders ingredient icons via react-native-svg, same icon keys

ADR-0002 stores each `IngredientTagValue`'s `icon` as a literal `react-icons/gi` component name (e.g. `"GiPig"`), resolved on the frontend with a one-line lookup into a hand-picked subset of the Game Icons set. `react-icons` renders via React DOM and does not run in React Native, so mobile needed its own resolution path. Rather than introduce a second, differently-keyed icon mapping (which is exactly what ADR-0002 chose not to do), mobile sources the same Game Icons SVG assets — the open icon set `react-icons/gi` itself wraps — for the same ~75 keys already curated in `frontend/src/meal/utils/ingredientIcons.ts` / `backend/src/meal/domain/catalog/data.ts`, and renders them with `react-native-svg`. The `icon` key stored in the catalog stays the single source of truth across both platforms; only the renderer differs per platform.

## Consequences

- Adding a new ingredient's icon means sourcing one more Game Icons SVG for the mobile asset set, in addition to the existing `react-icons/gi` import on web — two renderers to keep in sync per key, but no divergence in the domain data itself.
- Mobile's icon component becomes the platform-specific counterpart of `frontend/src/meal/utils/ingredientIcons.ts`, keyed identically, living in `mobile/MeNu`.
