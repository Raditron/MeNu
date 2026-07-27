import type { IngredientTagValue } from '../../../meal/types/tagValue'
import type { IngredientSelection } from '../../hooks/useAddMealForm'

interface IngredientSelectFieldProps {
  label: string
  options: IngredientTagValue[]
  selection: IngredientSelection
  onChange: (selection: IngredientSelection) => void
}

export function IngredientSelectField({ label, options, selection, onChange }: IngredientSelectFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={`${label}-select`}>{label}</label>
      <div className="ingredient-select-row">
        <select
          id={`${label}-select`}
          value={selection.tagValue?.title ?? ''}
          onChange={(event) => {
            const tagValue = options.find((option) => option.title === event.target.value) ?? null
            onChange({ ...selection, tagValue })
          }}
        >
          <option value="" disabled>
            Select {label.toLowerCase()}
          </option>
          {options.map((option) => (
            <option key={option.title} value={option.title}>
              {option.title}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={0}
          placeholder="grams"
          value={selection.grams || ''}
          onChange={(event) => onChange({ ...selection, grams: Number(event.target.value) })}
        />
      </div>
    </div>
  )
}
