import { IngredientValue } from "../catalog/value-objects/IngredientValue.js";

export default class Portion {
  private ingredient: IngredientValue;
  grams: number;
  constructor(tagValue: IngredientValue, grams: number) {
    this.ingredient = tagValue;
    this.grams = grams;
  }
  getIngredient() {
    return this.ingredient;
  }
  getCalories() {
    return this.grams * this.ingredient.caloriesPerGram;
  }
}
