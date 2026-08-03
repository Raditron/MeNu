import { Schema, model } from "mongoose";

export interface IngredientCatalogDocument {
  title: string;
  caloriesPerGram: number;
  icon: string;
  portionSizePerMeal: number;
}

export interface TagCatalogDocument {
  title: string;
}

const ingredientCatalogSchema = new Schema<IngredientCatalogDocument>({
  title: { type: String, required: true },
  caloriesPerGram: { type: Number, required: true },
  icon: { type: String, required: true },
  portionSizePerMeal: { type: Number, required: true },
});

const tagCatalogSchema = new Schema<TagCatalogDocument>({
  title: { type: String, required: true },
});

export const MeatTypeModel = model<IngredientCatalogDocument>(
  "MeatType",
  ingredientCatalogSchema,
);
export const SideTypeModel = model<IngredientCatalogDocument>(
  "SideType",
  ingredientCatalogSchema,
);
export const CuisineStyleModel = model<TagCatalogDocument>(
  "CuisineStyle",
  tagCatalogSchema,
);
export const FlavorProfileModel = model<TagCatalogDocument>(
  "FlavorProfile",
  tagCatalogSchema,
);
