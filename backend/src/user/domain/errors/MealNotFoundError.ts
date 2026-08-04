import { HttpError } from "../../../shared/errors/HttpError.js";

export class MealNotFoundError extends HttpError {
  readonly statusCode = 404;

  constructor(mealId: string) {
    super(`Meal with id ${mealId} not found`);
    this.name = "MealNotFoundError";
  }
}
