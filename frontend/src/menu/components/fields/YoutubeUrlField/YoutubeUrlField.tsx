import type { YoutubeUrlFieldProps } from './interfaces/YoutubeUrlField.interface'
import formFieldStyles from '../../../../shared/styles/formField.module.css'

export function YoutubeUrlField({ value, onChange }: YoutubeUrlFieldProps) {
  return (
    <div className={formFieldStyles.formField}>
      <label htmlFor="meal-youtube-url">YouTube video (optional)</label>
      <input
        id="meal-youtube-url"
        type="url"
        placeholder="https://www.youtube.com/watch?v=..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
