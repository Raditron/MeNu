import TagValue from "../catalog/value-objects/TagValue.js";

export class Mood {
  /**
   *
   */
  meatType: TagValue;
  sideType: TagValue;
  cuisineStyles: TagValue[] | null;
  flavorProfiles: TagValue[] | null;
  constructor(
    meatType: TagValue,
    sideType: TagValue,
    cuisineStyles: TagValue[] | null,
    flavorProfiles: TagValue[] | null,
  ) {
    this.meatType = meatType;
    this.sideType = sideType;
    this.cuisineStyles = cuisineStyles;
    this.flavorProfiles = flavorProfiles;
  }
}
