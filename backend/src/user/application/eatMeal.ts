import { UserRepository } from "../domain/UserRepository.js";

export class EatMeal {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(uid: string, mealId: string): Promise<void> {
    const date = new Date();
    return this.userRepository.eatMeal(uid, mealId, date);
  }
}
