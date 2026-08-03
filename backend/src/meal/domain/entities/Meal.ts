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
  youtubeURL? : string;
  private totalCalories: number;
  private numberOfPortions: number;
  constructor(name: string, meatType: Portion, sideType: Portion, id?: string, youtubeURL?: string) {
    this.youtubeURL = youtubeURL;
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
    this.numberOfPortions = Math.floor(
      Math.min(meatType.getNumberOfPortions(), sideType.getNumberOfPortions()),
    );
  }
  getTotalCalories() {
    return this.totalCalories;
  }
  getNumberOfPortions() {
    return this.numberOfPortions;
  }
}
