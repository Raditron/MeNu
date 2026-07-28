# Mobile styling via RN StyleSheet + a shared theme module, not NativeWind

Web styles each component with a sibling CSS Module (`styles/X.module.css`) that reads design tokens from CSS custom properties defined once in `frontend/src/index.css` (`--text`, `--canvas`, `--accent`, `--border`, `--shadow-card`, `--radius-card`, etc.), with light/dark variants swapped automatically via `prefers-color-scheme`. CSS Modules don't exist in React Native. We considered NativeWind (Tailwind-style utility classes for RN) but chose plain `StyleSheet.create` per component, sourcing values from a shared `theme.ts` that mirrors the same token names/values (light + dark) and is read via `useColorScheme()`. This keeps the same file-per-component shape the web app already uses (`styles/X.module.css` → `styles/X.styles.ts`) and introduces no new styling paradigm or dependency, at the cost of being more verbose than utility classes.

## Consequences

- Every mobile component keeps a 1:1-named `styles/X.styles.ts` sibling, same as its web counterpart's `styles/X.module.css` — easy to cross-reference when porting a screen.
- `theme.ts` is the mobile counterpart of `index.css`'s `:root`/dark-mode blocks; the two must be kept in sync by hand when a token changes, since they aren't literally shared (RN can't consume CSS custom properties).
