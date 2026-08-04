# MeNu

A web app that helps a user pick what to eat: browse a full menu of meals, or take a quiz that surfaces the meals matching their current mood.

## Language

**Meal**:
A dish on the menu — has a name, a picture, and a set of category values (Meat Type, Side Type, Cuisine Style, Flavor Profile).
_Avoid_: Item, dish, food

**Category**:
One of the four fixed dimensions a Meal is classified along: Meat Type, Side Type, Cuisine Style, Flavor Profile. Each Category is either single-select or multi-select.
_Avoid_: Tag group, attribute

**Meat Type**:
Single-select Category naming the meal's protein (e.g. pork, chicken, shrimp).

**Side Type**:
Single-select Category naming the meal's side (e.g. salad, potatoes, rice, pasta).

**Cuisine Style**:
Multi-select Category naming the culinary tradition(s) a meal draws from (e.g. asian, indian, italian).

**Flavor Profile**:
Multi-select Category naming the taste characteristics of a meal (e.g. creamy, tangy, tomato-y).

**Quiz**:
A sequence of one question per Category. Single-select Categories (Meat Type, Side Type) ask for one answer; multi-select Categories (Cuisine Style, Flavor Profile) allow picking multiple answers. Completing the Quiz produces a Mood.

**Mood**:
The user's answers to the Quiz — one value (or set of values, for multi-select Categories) per Category. Used to score every Meal by overlap.
_Avoid_: Preferences, answers

**Match Score**:
A 0.0–1.0 value (displayed to the user as a percentage, "n% match") expressing how well a Meal fits a Mood, computed as the equally-weighted average of per-Category overlap across all 4 Categories. A multi-select Category with zero Tag Values on the Meal scores 0 for that Category rather than being undefined or excluded. Every Meal gets a Match Score and is shown, ranked by it — nothing is filtered out.
_Avoid_: Fit, ranking, relevance

**Tag Value**:
One selectable option within a Category (e.g. "pork" within Meat Type, "tangy" within Flavor Profile). Base shape: a title only.
_Avoid_: Option, tag

**Ingredient Tag Value**:
A Tag Value that also carries a Calorie Density and an Icon — used only for Meat Type and Side Type values. Cuisine Style and Flavor Profile Tag Values are plain Tag Values with no calorie data or icon.
_Avoid_: Ingredient tag

**Icon**:
A picture representing an Ingredient Tag Value (e.g. a pig for "pork"), shown alongside its title in the Quiz and on a Meal's card. Defined only on Ingredient Tag Values.

**Calorie Density**:
Calories per gram, defined only on Ingredient Tag Values (Meat Type/Side Type; e.g. pork = 2.4 cal/g).

**Portion**:
The gram amount a Meal contains of its Meat Type and Side Type Tag Value. Combined with that Tag Value's Calorie Density to compute the Meal's total calories.
_Avoid_: Serving size, quantity

**Eaten History**:
The ordered list of Eaten Entries recorded against a Meal, appended to every time the user marks that Meal as eaten.
_Avoid_: Log, eat records

**Eaten Entry**:
One item in a Meal's Eaten History, pairing the Meal with the date it was eaten.
_Avoid_: History entry, log entry, eat record

**Meal History**:
The page listing every Eaten Entry across the user's Menu as a single reverse-chronological feed, filterable by meal name, a preset date range, and Category.
_Avoid_: History log, eaten log

**Protected Route**:
A route that requires an authenticated Session to view. Visiting it while unauthenticated redirects to `/login`.
_Avoid_: Private route, guarded route

**Public Route**:
A route accessible regardless of auth state. The explicit allowlist against the default-protected model: `/login`, `/register`, `/forgot-password`, `/change-password`.
_Avoid_: Open route, unguarded route

**Session**:
The current signed-in user's authentication state, sourced from Firebase Auth. Absent for an unauthenticated visitor; unresolved for a brief moment on initial load until Firebase reports back.
_Avoid_: Auth state
