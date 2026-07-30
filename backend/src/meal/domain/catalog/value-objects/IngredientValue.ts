import TagValue from "./TagValue.js";

export class IngredientValue extends TagValue {
  caloriesPerGram: number;
  icon?: string;
  constructor(title: string, caloriesPerGram: number, icon?: string) {
    super(title);
    this.caloriesPerGram = caloriesPerGram;
    this.icon = icon;
  }
}
