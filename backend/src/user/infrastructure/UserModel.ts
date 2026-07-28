import { Schema, model } from "mongoose";
import { mealSchema, type MealDocument } from "../../meal/infrastructure/MealModel.js";

export interface MenuDocument {
  meals: MealDocument[];
}

export interface UserDocument {
  _id: string;
  email: string;
  menu: MenuDocument;
}

const menuSchema = new Schema<MenuDocument>(
  {
    meals: { type: [mealSchema], required: true },
  },
  { _id: false },
);

const userSchema = new Schema<UserDocument>({
  _id: { type: String, required: true },
  email: { type: String, required: true },
  menu: { type: menuSchema, required: true },
});

export const UserModel = model<UserDocument>("User", userSchema);
