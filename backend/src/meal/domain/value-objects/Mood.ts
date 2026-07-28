import TagValue from "../catalog/value-objects/TagValue.js";

export class Mood {
  /**
   *
   */
  meatType: TagValue;
  sideType: TagValue;
  cuisineStyles: TagValue[];
  flavorProfiles: TagValue[];
  constructor(
    meatType: TagValue,
    sideType: TagValue,
    cuisineStyles: TagValue[],
    flavorProfiles: TagValue[],
  ) {
    this.meatType = meatType;
    this.sideType = sideType;
    this.cuisineStyles = cuisineStyles;
    this.flavorProfiles = flavorProfiles;
  }
}
