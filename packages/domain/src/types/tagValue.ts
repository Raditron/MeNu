export interface TagValue {
  title: string
}

export interface IngredientTagValue extends TagValue {
  caloriesPerGram: number
  icon: string
  portionSizePerMeal: number
}
