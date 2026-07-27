import type { TagMultiSelectFieldProps } from './interfaces/TagMultiSelectField.interface'
import styles from './styles/TagMultiSelectField.module.css'
import formFieldStyles from '../../../../shared/styles/formField.module.css'

export function TagMultiSelectField({ label, options, selected, onToggle }: TagMultiSelectFieldProps) {
  const selectedTitles = new Set(selected.map((value) => value.title))

  return (
    <div className={formFieldStyles.formField}>
      <label>{label}</label>
      <div className={styles.tagMultiSelect}>
        {options.map((option) => (
          <button
            key={option.title}
            type="button"
            className={`${styles.tagOption}${selectedTitles.has(option.title) ? ` ${styles.selected}` : ''}`}
            onClick={() => onToggle(option)}
          >
            {option.title}
          </button>
        ))}
      </div>
    </div>
  )
}
