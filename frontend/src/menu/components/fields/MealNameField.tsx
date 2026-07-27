interface MealNameFieldProps {
  value: string
  onChange: (value: string) => void
}

export function MealNameField({ value, onChange }: MealNameFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor="meal-name">Meal name</label>
      <input id="meal-name" type="text" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
}
