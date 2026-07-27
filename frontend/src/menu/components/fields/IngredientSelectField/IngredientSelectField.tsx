import type { IngredientSelectFieldProps } from './interfaces/IngredientSelectField.interface'
import styles from './styles/IngredientSelectField.module.css'
import formFieldStyles from '../../../../shared/styles/formField.module.css'

export function IngredientSelectField({ label, options, selection, onChange }: IngredientSelectFieldProps) {
  return (
    <div className={formFieldStyles.formField}>
      <label htmlFor={`${label}-select`}>{label}</label>
      <div className={styles.ingredientSelectRow}>
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
