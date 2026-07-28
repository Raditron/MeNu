import { IngredientValue } from "../catalog/value-objects/IngredientValue.js";
import TagValue from "../catalog/value-objects/TagValue.js";

export default class Catalog {
  meatTypes: IngredientValue[];
  sideTypes: IngredientValue[];
  cuisineStyles: TagValue[];
  flavorProfiles: TagValue[];

  constructor(
    meatTypes: IngredientValue[],
    sideTypes: IngredientValue[],
    cuisineStyles: TagValue[],
    flavorProfiles: TagValue[],
  ) {
    this.meatTypes = meatTypes;
    this.sideTypes = sideTypes;
    this.cuisineStyles = cuisineStyles;
    this.flavorProfiles = flavorProfiles;
  }
}
