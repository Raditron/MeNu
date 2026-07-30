export class MealNotFoundError extends Error {
  constructor(mealId: string) {
    super(`Meal with id ${mealId} not found`);
    this.name = "MealNotFoundError";
  }
}
