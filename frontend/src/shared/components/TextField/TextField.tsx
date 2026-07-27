import type { TextFieldProps } from './interfaces/TextField.interface'
import formFieldStyles from '../../styles/formField.module.css'

export function TextField({ id, label, type = 'text', value, onChange, autoComplete }: TextFieldProps) {
  return (
    <div className={formFieldStyles.formField}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        required
      />
    </div>
  )
}
