import Meal from "../../../meal/domain/value-objects/Meal.js";

export default class Menu {
  meals: Meal[];
  constructor(meals: Meal[]) {
    this.meals = meals;
  }
  getTotalCalories() {
    return this.meals.reduce((acc, meal) => acc + meal.getTotalCalories(), 0);
  }
  addMeal(meal: Meal) {
    this.meals.push(meal);
  }
}
