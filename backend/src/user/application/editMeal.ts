import Meal from "../../meal/domain/entities/Meal.js";
import { UserRepository } from "../domain/UserRepository.js";

export class EditMeal {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(uid: string, newMeal: Meal): Promise<void> {
    return this.userRepository.editUserMeal(uid, newMeal);
  }
}
