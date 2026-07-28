import { IngredientValue } from "./value-objects/IngredientValue.js";
import TagValue from "./value-objects/TagValue.js";

export interface CatalogRepository {
  getMeatTypes(): Promise<IngredientValue[]>;
  getSideTypes(): Promise<IngredientValue[]>;
  getCuisineStyles(): Promise<TagValue[]>;
  getFlavorProfiles(): Promise<TagValue[]>;
}
