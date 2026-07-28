import type Meal from "../../meal/domain/value-objects/Meal.js";
import { UserRepository } from "../domain/UserRepository.js";

export class GetMeals {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(uid: string): Promise<Meal[]> {
    return this.userRepository.getMealsByUid(uid);
  }
}
