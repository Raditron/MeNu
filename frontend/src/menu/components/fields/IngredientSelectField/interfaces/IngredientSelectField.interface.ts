import type { IngredientTagValue } from '../../../../../meal/types/tagValue'
import type { IngredientSelection } from '../../../../hooks/useAddMealForm'

export interface IngredientSelectFieldProps {
  label: string
  options: IngredientTagValue[]
  selection: IngredientSelection
  onChange: (selection: IngredientSelection) => void
}
