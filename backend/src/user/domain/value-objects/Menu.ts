import Meal from "../../../meal/domain/entities/Meal.js";

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
  editMeal(meal: Meal) {
    const index = this.meals.findIndex(m => m.id === meal.id);
    if (index === -1) {
      throw new Error(`Meal with id ${meal.id} not found in menu`);
    }
    this.meals[index] = meal;
  }
}
