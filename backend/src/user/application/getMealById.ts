import type Meal from "../../meal/domain/entities/Meal.js";
import { UserRepository } from "../domain/UserRepository.js";
import { MealNotFoundError } from "../domain/errors/MealNotFoundError.js";

export class GetMealById {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(uid: string, mealId: string): Promise<Meal> {
    const meal = await this.userRepository.getMealByUid(uid, mealId);
    if (!meal) {
      throw new MealNotFoundError(mealId);
    }
    return meal;
  }
}
