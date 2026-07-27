import type { TagValue } from '../../../meal/types/tagValue'

interface TagMultiSelectFieldProps {
  label: string
  options: TagValue[]
  selected: TagValue[]
  onToggle: (value: TagValue) => void
}

export function TagMultiSelectField({ label, options, selected, onToggle }: TagMultiSelectFieldProps) {
  const selectedTitles = new Set(selected.map((value) => value.title))

  return (
    <div className="form-field">
      <label>{label}</label>
      <div className="tag-multi-select">
        {options.map((option) => (
          <button
            key={option.title}
            type="button"
            className={selectedTitles.has(option.title) ? 'tag-option selected' : 'tag-option'}
            onClick={() => onToggle(option)}
          >
            {option.title}
          </button>
        ))}
      </div>
    </div>
  )
}
