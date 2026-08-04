import { HttpError } from "../../../shared/errors/HttpError.js";

export class MealOnCooldownError extends HttpError {
  readonly statusCode = 409;

  constructor() {
    super("Meal cannot be eaten again within 6 hours of the last time");
    this.name = "MealOnCooldownError";
  }
}
