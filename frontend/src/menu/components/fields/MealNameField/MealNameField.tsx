import type { MealNameFieldProps } from './interfaces/MealNameField.interface'
import formFieldStyles from '../../../../shared/styles/formField.module.css'

export function MealNameField({ value, onChange }: MealNameFieldProps) {
  return (
    <div className={formFieldStyles.formField}>
      <label htmlFor="meal-name">Meal name</label>
      <input id="meal-name" type="text" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
}
