import type { TagValue } from './tagValue'

export type SelectionMode = 'single' | 'multi'

export interface Category<TValue extends TagValue = TagValue> {
  name: string
  selectionMode: SelectionMode
  options: TValue[]
}
