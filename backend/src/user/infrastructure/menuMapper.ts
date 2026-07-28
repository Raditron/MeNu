import Menu from "../domain/value-objects/Menu.js";
import { toDomainMeal, toPersistenceMeal } from "../../meal/infrastructure/mealMapper.js";
import type { MenuDocument } from "./UserModel.js";

export function toDomainMenu(doc: MenuDocument): Menu {
  return new Menu(doc.meals.map(toDomainMeal));
}

export function toPersistenceMenu(menu: Menu): MenuDocument {
  return {
    meals: menu.meals.map(toPersistenceMeal),
  };
}
