import Meal from "../../meal/domain/entities/Meal.js";
import type { User } from "./User.js";

export interface UserRepository {
  findByUId(uid: string): Promise<User | null>;
  addToMenu(uid: string, meal: Meal): Promise<void>;
  create(uid: string, email: string): Promise<User>;
  login(uid: string, email: string): Promise<User | null>;
  getMealsByUid(uid: string): Promise<Meal[] | []>;
  getMealByUid(uid: string, mealId: string): Promise<Meal | null>;
  getUserByUid(uid: string): Promise<User | null>;
  editUserMeal(uid: string, newMeal: Meal): Promise<void>;
  eatMeal(uid: string, mealId: string, date: Date): Promise<void>;
}
