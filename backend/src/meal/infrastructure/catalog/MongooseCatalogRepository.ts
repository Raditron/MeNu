import type { CatalogRepository } from "../../domain/catalog/CatalogRepository.js";
import { IngredientValue } from "../../domain/catalog/value-objects/IngredientValue.js";
import TagValue from "../../domain/catalog/value-objects/TagValue.js";
import {
  MeatTypeModel,
  SideTypeModel,
  CuisineStyleModel,
  FlavorProfileModel,
} from "./CatalogModel.js";

export class MongooseCatalogRepository implements CatalogRepository {
  async getMeatTypes(): Promise<IngredientValue[]> {
    const docs = await MeatTypeModel.find();
    return docs.map(doc => new IngredientValue(doc.title, doc.caloriesPerGram, doc.icon));
  }

  async getSideTypes(): Promise<IngredientValue[]> {
    const docs = await SideTypeModel.find();
    return docs.map(doc => new IngredientValue(doc.title, doc.caloriesPerGram, doc.icon));
  }

  async getCuisineStyles(): Promise<TagValue[]> {
    const docs = await CuisineStyleModel.find();
    return docs.map(doc => new TagValue(doc.title));
  }

  async getFlavorProfiles(): Promise<TagValue[]> {
    const docs = await FlavorProfileModel.find();
    return docs.map(doc => new TagValue(doc.title));
  }
}
