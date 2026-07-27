# Visual redesign strategy

Brings the whole app (NavBar, Menu grid, Add Meal modal, Quiz) from the current flat/bordered look to a soft, shadow-elevated visual language in the spirit of Airbnb/Instagram/Facebook onboarding flows, using the existing gold palette from [instructions.md](../../instructions.md).

**Reference mockup (approved):** https://claude.ai/code/artifact/b2e2ebfa-e559-4edc-9af6-4fd4d0b33077 — click through Menu, Quiz (all 4 steps), Results, and Add Meal to see every state. Treat it as the source of truth for spacing/motion feel; this doc is the token/spec breakdown behind it.

## Design tokens

### Color

The existing 5-step gold ramp (`#dcd684 → #d3bf64 → #cca746 → #c68d29 → #bf7308`) stays as the only accent family. What changes is splitting `--bg` into two tokens, so shadow-elevated cards have something to float above:

| Token | Light | Dark | Notes |
|---|---|---|---|
| `--canvas` | `#f7f4ea` | `#15161b` | Page background. Warm off-white in light mode (tinted from `#dcd684` at low saturation), not pure white. |
| `--surface` | `#ffffff` | `#202129` | Card/modal background. Must read as lighter-than-canvas in dark mode — that's what makes elevation visible. |
| `--text-h` | `#211b0f` | `#f3f1e9` | Headings, warm-biased (not cool gray) to match the palette. |
| `--text` | `#6b6357` | `#a49b8a` | Body/secondary text. |
| `--text-soft` | `#948c7c` | `#766c5c` | Captions, hints, metadata (portions, calories label). |
| `--accent` | `#c68d29` (ramp step 4) | `#d3bf64` (ramp step 2) | Same dark-mode override pattern already in [index.css](../../frontend/src/index.css). |
| `--accent-cta-text` | `#201400` | `#201400` | Text on filled-accent surfaces (unchanged from current). |
| `--border-subtle` | `rgba(33,27,15,.09)` | `rgba(255,255,255,.08)` | Only for form inputs and the progress-bar track — never for cards. |
| `--tag-bg` / `--tag-text` | `#f2ecc9` / `#6b5a1a` | `#3a3520` / `#dcd684` | Unchanged from current tokens. |

Shadows replace borders as the card-separation mechanism:

- `--shadow-card`: `0 1px 2px rgba(33,27,15,.04), 0 10px 28px -10px rgba(33,27,15,.22)` (dark: opacity raised to `.3`/`.6`)
- `--shadow-modal`: same shape, deeper spread — `0 24px 70px -16px rgba(33,27,15,.4)` (dark: `.7`)

### Shape grammar

Three shapes, each meaning one thing consistently across the app:

- **Pill (`border-radius: 999px`)** = a label or a tag — `.tag-badge`, `.match-badge`, the multi-select `.tag-option` chips in the Add Meal modal.
- **Rounded-rectangle (`~13px`, `--radius-btn`)** = an action — every `<button>`: Next/Back, Add Meal, Retake quiz, Cancel, NavBar links.
- **Large rounded-rectangle (`~16–22px`, `--radius-card`)** = a container — Meal cards, quiz option cards, the modal.

Don't blur these: a button should never be a pill, and a tag should never be rounded-rectangle. This is what keeps "clickable action" visually distinct from "selectable choice" in the quiz specifically.

### Typography

No new font stack — keep `system-ui, 'Segoe UI', Roboto, sans-serif` (already `--sans`/`--heading` in [index.css](../../frontend/src/index.css)). One scale change: the quiz question title becomes the one bold focal moment in the app.

- Quiz question `<h2>` (e.g. "Meat Type"): `34px / 700 / -0.5px` letter-spacing — up from today's `24px / 500`.
- Everything else (Meal card names, modal title, NavBar brand): unchanged weight/size.
- New small-caps-style caption above the quiz question ("STEP 1 OF 4"): `12.5px / 600`, `0.6px` letter-spacing, uppercase, `--text-soft` — secondary to the progress bar below, not competing with it.

## Component specs

### NavBar ([NavBar.tsx](../../frontend/src/shared/components/NavBar.tsx))
No structural change. Active-link background switches from the current ad-hoc `8px` radius to `--radius-btn` (~13px) for consistency with the button grammar. "Quiz" keeps its filled-accent treatment as the app's primary CTA.

### Meal card ([MealCard.tsx](../../frontend/src/meal/components/MealCard.tsx), `.meal-card` in [App.css](../../frontend/src/App.css))
- Drop the `1px solid var(--border)` outline; add `--shadow-card`, `border-radius: --radius-card` (20px).
- Picture area: no real images yet, so keep it a flat tinted block with a large centered emoji keyed off `meatType` (placeholder until real photography/illustration exists — same "temp for now" approach as the current `PLACEHOLDER_MEAL_PICTURE`).
- Match badge stays a pill, filled accent (unchanged pattern, just riding the new radius tokens).
- **No hover-lift.** Cards aren't clickable to anything today (no detail route) — motion here would be a false affordance. Revisit if/when Meal cards gain a click target.

### Add Meal modal ([AddMealModal.tsx](../../frontend/src/menu/components/AddMealModal.tsx), `.modal` in [App.css](../../frontend/src/App.css))
- `--shadow-modal`, `border-radius: 22px`, backdrop gets a slight `blur(2px)` over the existing dark overlay.
- **Must never scroll.** Replace the current `max-height: 90vh; overflow-y: auto` with fluid `clamp()`-based padding/gaps/font-sizes tied to viewport height (see the mockup's `.modal`/`.form-field`/`.tag-option` rules for the exact clamp values) so the whole form compresses to fit any viewport instead of overflowing into a scrollbar. This was confirmed against the mockup — the first pass scrolled on shorter screens and was called out as the one thing to fix.
- Inputs/selects: `--canvas` background (not `--surface`), `10px` radius, `1.5px solid var(--border-subtle)` — the one place a subtle border is still correct, since form fields aren't "cards."

### Quiz step ([QuizStep.tsx](../../frontend/src/quiz/components/QuizStep.tsx), [QuizOption.tsx](../../frontend/src/quiz/components/QuizOption.tsx))
- Replace the "Step X of 4" text block with a **thin top progress bar** (`6px`, pill track in `--border-subtle`, fill in a gradient across the accent ramp `--accent-2 → --accent-5`, animated width transition `0.35s`). The small uppercase step caption stays underneath it as secondary confirmation, not the primary indicator.
- Options become **card tiles** in a responsive grid (2 columns at this width), not pills:
  - Meat Type / Side Type (concrete nouns): emoji + label. Emoji is an explicit placeholder for real iconography later — 🐖🍗🦐🥩 / 🥗🥔🍚🍝.
  - Cuisine Style / Flavor Profile (abstract adjectives): label only, same card shell, no icon slot forced onto values like "tangy" that don't sketch cleanly.
- Selected state: surface and shadow stay put (don't fill solid — that would fight the elevation language); add a `2px` accent border ring + a small circular accent checkmark badge overlapping the top-right corner.
- **Single-select auto-advances** on tap (Meat Type, Side Type) — no visible Next button on those steps, just Back. **Multi-select requires the explicit Next/"See results" button** (Cuisine Style, Flavor Profile), since "done picking" needs confirmation when more than one pick is valid.
- Back/Next buttons: rounded-rectangle, `--radius-btn`, filled-accent primary / ghost secondary — matching the button grammar, visually distinct from the option cards so "act" and "choose" never look the same.

### Quiz results ([QuizResults.tsx](../../frontend/src/quiz/components/QuizResults.tsx))
Reuses the redesigned Meal card as-is (match badge, tags, shadow). Header ("Your matches" + "Retake quiz") follows the same button/heading tokens as everywhere else — no separate treatment needed.

## Out of scope for this pass

- Real illustrations/icons to replace the emoji placeholders.
- A Meal-card detail view (and, with it, hover-lift affordance on the card).
- Any change to the underlying quiz logic/scoring — this is visual only; [useQuizWizard.ts](../../frontend/src/quiz/hooks/useQuizWizard.ts) and [calculateMatchScore.ts](../../frontend/src/meal/utils/calculateMatchScore.ts) are unchanged.
