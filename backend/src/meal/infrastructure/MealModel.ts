import { Schema, Types } from "mongoose";

export interface TagValueDocument {
  title: string;
}

export interface IngredientValueDocument extends TagValueDocument {
  caloriesPerGram: number;
  icon?: string;
}

export interface PortionDocument {
  ingredient: IngredientValueDocument;
  grams: number;
}

export interface MealDocument {
  _id?: Types.ObjectId;
  name: string;
  meatType: PortionDocument;
  sideType: PortionDocument;
  cuisineStyles?: TagValueDocument[];
  flavorProfiles?: TagValueDocument[];
  totalCalories: number;
}

export const tagValueSchema = new Schema<TagValueDocument>(
  {
    title: { type: String, required: true },
  },
  { _id: false },
);

export const ingredientValueSchema = new Schema<IngredientValueDocument>(
  {
    title: { type: String, required: true },
    caloriesPerGram: { type: Number, required: true },
    icon: { type: String, required: false },
  },
  { _id: false },
);

export const portionSchema = new Schema<PortionDocument>(
  {
    ingredient: { type: ingredientValueSchema, required: true },
    grams: { type: Number, required: true },
  },
  { _id: false },
);

export const mealSchema = new Schema<MealDocument>({
  name: { type: String, required: true },
  meatType: { type: portionSchema, required: true },
  sideType: { type: portionSchema, required: true },
  cuisineStyles: { type: [tagValueSchema], required: false },
  flavorProfiles: { type: [tagValueSchema], required: false },
  totalCalories: { type: Number, required: true },
});
