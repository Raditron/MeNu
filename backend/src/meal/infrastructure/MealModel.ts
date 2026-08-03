import { Schema, Types } from "mongoose";

export interface TagValueDocument {
  title: string;
}

export interface PortionDocument {
  ingredientTitle: string;
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
  youtubeURL?: string;
}

export const tagValueSchema = new Schema<TagValueDocument>(
  {
    title: { type: String, required: true },
  },
  { _id: false },
);

export const portionSchema = new Schema<PortionDocument>(
  {
    ingredientTitle: { type: String, required: true },
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
  youtubeURL: { type: String, required: false },
});
