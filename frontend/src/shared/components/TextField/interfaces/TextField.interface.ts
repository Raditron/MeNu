export interface TextFieldProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  autoComplete?: string
}
