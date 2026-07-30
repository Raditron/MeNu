import Portion from "../value-objects/Portion.js";
import TagValue from "../catalog/value-objects/TagValue.js";
import { meatTypes, sideTypes } from "../catalog/data.js";

export default class Meal {
  id?: string;
  name: string;
  meatType: Portion;
  sideType: Portion;
  cuisineStyles?: TagValue[];
  flavorProfiles?: TagValue[];
  private totalCalories: number;
  constructor(name: string, meatType: Portion, sideType: Portion, id?: string) {
    if (!meatTypes.some(m => m.title === meatType.getIngredient().title)) {
      throw new Error(
        `${meatType.getIngredient().title} is not a valid meat type`,
      );
    }
    if (!sideTypes.some(s => s.title === sideType.getIngredient().title)) {
      throw new Error(
        `${sideType.getIngredient().title} is not a valid side type`,
      );
    }
    this.id = id;
    this.name = name;
    this.meatType = meatType;
    this.sideType = sideType;
    this.totalCalories = meatType.getCalories() + sideType.getCalories();
  }
  getTotalCalories() {
    return this.totalCalories;
  }
}
