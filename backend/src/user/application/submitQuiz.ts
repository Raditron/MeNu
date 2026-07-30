import Meal from "../../meal/domain/entities/Meal.js";
import { Mood } from "../../meal/domain/value-objects/Mood.js";
import { UserRepository } from "../domain/UserRepository.js";
import { UserNotFoundError } from "../domain/errors/UserNotFoundError.js";
import { calculateMatchScore } from "../utils/calculateMatchScore.js";

interface QuizResults {
  meals: Meal[];
}

export class SubmitQuiz {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(uid: string, mood: Mood): Promise<QuizResults> {
    const user = await this.userRepository.findByUId(uid);
    if (!user) {
      throw new UserNotFoundError(uid);
    }

    const meals = [...user.menu.meals].sort(
      (a, b) => calculateMatchScore(b, mood) - calculateMatchScore(a, mood),
    );

    return { meals };
  }
}
