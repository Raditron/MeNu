# Menu & Meal structure (proposed)

Suggested field-level shape for the backend `Meal` and `Menu` value objects
(`backend/src/user/value-objects/`), derived from what the frontend already
implements (`frontend/src/meal/types/*`, `frontend/src/backend-temp/*`) and
the domain language in `CONTEXT.md`. Nothing here has been implemented —
this is a proposal to review before touching the code.

## Why these fields

The frontend already has a working, exercised model: `Meal` is rendered in
`MealCard`, scored in `calculateMatchScore`, priced in calories via
`calculateCalories`, and built up field-by-field in `useAddMealForm`. The
backend value objects should mirror that shape exactly rather than invent a
new one — the current `Meal.ts`/`Menu.ts` stubs (`title`/`description`
fields) predate this and don't match either the frontend or the
`CONTEXT.md` glossary (which defines Meal as: name, picture, and category
values — no description).

## `TagValue`

One selectable option within a Category (glossary: *Tag Value*).

| Field | Type     | Notes |
|-------|----------|-------|
| title | `string` | The option's label, e.g. `"pork"`, `"tangy"`. Acts as the identity for equality/lookup (see `useAddMealForm`'s `toggleTagValue`, matched by `title`). |

## `IngredientTagValue extends TagValue`

A Tag Value that also carries a Calorie Density and an Icon — only used for
Meat Type and Side Type values (glossary: *Ingredient Tag Value*).

| Field           | Type     | Notes |
|-----------------|----------|-------|
| title           | `string` | Inherited from `TagValue`. |
| caloriesPerGram | `number` | Calorie Density. Only meaningful on Meat Type / Side Type values; Cuisine Style and Flavor Profile use plain `TagValue`. |
| icon            | `string` | The name of a `react-icons/gi` (Game Icons) component, e.g. `"GiPig"`. Only meaningful on Meat Type / Side Type values. See `docs/adr/0002-ingredient-icon-as-react-icons-key.md`. |

## `Portion`

The gram amount a Meal contains of its Meat Type or Side Type value
(glossary: *Portion*).

| Field    | Type                 | Notes |
|----------|----------------------|-------|
| tagValue | `IngredientTagValue` | Which ingredient (e.g. `chicken`, `rice`). |
| grams    | `number`             | Combined with `tagValue.caloriesPerGram` to compute this portion's calories (`grams * caloriesPerGram`). |

## `Meal`

A dish on the menu (glossary: *Meal*. Avoid: Item, dish, food).

| Field          | Type          | Notes |
|----------------|---------------|-------|
| id             | `string`      | Unique identifier. |
| name           | `string`      | Display name, e.g. `"Pork Fried Rice"`. Not `title` — `title` is the field name used on `TagValue`, keeping the two distinct avoids confusion between a Meal's name and a Tag Value's label. |
| pictureUrl     | `string`      | URL/path to the meal's picture. |
| meatType       | `Portion`     | The Meat Type Category value + grams. Single-select. |
| sideType       | `Portion`     | The Side Type Category value + grams. Single-select. |
| cuisineStyles  | `TagValue[]`  | Cuisine Style Category values. Multi-select — can be empty. |
| flavorProfiles | `TagValue[]`  | Flavor Profile Category values. Multi-select — can be empty. |

Derived (not stored, computed on demand — see `calculateCalories` /
`calculateMatchScore` on the frontend):
- **Total calories** = `meatType.grams * meatType.tagValue.caloriesPerGram + sideType.grams * sideType.tagValue.caloriesPerGram`
- **Match Score** against a `Mood` = equally-weighted average of per-Category overlap across all 4 categories.

No `description` field — the frontend never collects or displays one
(`useAddMealForm` only takes name, meat/side type, cuisine styles, flavor
profiles).

## `Menu`

The full collection of Meals a User can browse/pick from (the app's core
"browse a full menu of meals" concept from `CONTEXT.md`'s opening line).
Owned by `User` (`backend/src/user/domain/User.ts` has a `menu` field).

| Field | Type     | Notes |
|-------|----------|-------|
| meals | `Meal[]` | The Meals in this Menu. |

Open question worth deciding before implementing: is `Menu` a plain
holder (`{ meals: Meal[] }`), or should it own invariants/behavior (e.g.
rejecting duplicate `id`s, an `addMeal` that returns a new `Menu`)? The
frontend's `addMeal`/`saveMeal` (`frontend/src/backend-temp/api.ts`,
`store.ts`) currently just appends to an array with no such rules, so a
plain holder matches today's behavior; add invariants only when a real
rule shows up (e.g. once meals are persisted per-user and dedup matters).

## Supporting types not yet in the backend

The frontend also has `Category` (`frontend/src/meal/types/category.ts`)
and `Mood` (`frontend/src/meal/types/mood.ts`), used for the Quiz and
Match Score features. These aren't part of `Meal`/`Menu` themselves and
aren't covered here, but will need a backend home if/when the Quiz moves
server-side.
