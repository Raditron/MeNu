# Meal History's date filter uses preset range chips, not a date picker

No date-picker component or library exists anywhere in the app today, and mobile has no date-picker dependency installed. The Meal History date filter uses preset range chips ("Last 7 days" / "Last 30 days" / "All time") instead of a real from/to date picker, reusing the same chip styling as the Category filters. We considered a true date picker (native `<input type="date">` on web, `@react-native-community/datetimepicker` on mobile), but rejected it for now: it would add a new native dependency to mobile for marginal precision gain over presets.

## Consequences

- Users cannot pick an arbitrary custom date range on Meal History, only the fixed presets.
- If arbitrary-range filtering becomes a real need, this decision should be revisited alongside adding a date-picker dependency to mobile.
