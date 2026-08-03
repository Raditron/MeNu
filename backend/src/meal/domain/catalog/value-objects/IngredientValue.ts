import TagValue from "./TagValue.js";

export class IngredientValue extends TagValue {
  caloriesPerGram: number;
  icon?: string;
  portionSizePerMeal: number;
  constructor(title: string, caloriesPerGram: number, icon?: string, portionSizePerMeal = 0) {
    super(title);
    this.caloriesPerGram = caloriesPerGram;
    this.icon = icon;
    this.portionSizePerMeal = portionSizePerMeal;
  }
}
