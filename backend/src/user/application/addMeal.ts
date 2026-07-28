import Meal from "../../meal/domain/value-objects/Meal.js";
import { UserRepository } from "../domain/UserRepository.js";

export class AddMeal {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(uid: string, meal: Meal): Promise<void> {
    return this.userRepository.addToMenu(uid, meal);
  }
}
