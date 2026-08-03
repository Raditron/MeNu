import { IngredientValue } from "../catalog/value-objects/IngredientValue.js";

export default class Portion {
  private ingredient: IngredientValue;
  private portionSizePerMeal: number;
  grams: number;
  constructor(tagValue: IngredientValue, grams: number) {
    this.ingredient = tagValue;
    this.grams = grams;
    this.portionSizePerMeal = this.ingredient.portionSizePerMeal;

    if (this.portionSizePerMeal === 0)
      throw new Error("PortionSize Cannot be 0");
    if (this.portionSizePerMeal < 0)
      throw new Error("PortionSize Cannot be negative");
  }
  getIngredient() {
    return this.ingredient;
  }
  getCalories() {
    return this.grams * this.ingredient.caloriesPerGram;
  }
  getPortionSizePerMeal() {
    return this.portionSizePerMeal;
  }
  getNumberOfPortions() {
    return this.grams / this.portionSizePerMeal;
  }
}
