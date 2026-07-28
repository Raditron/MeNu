import Meal from "../domain/value-objects/Meal.js";
import Portion from "../domain/value-objects/Portion.js";
import { IngredientValue } from "../domain/catalog/value-objects/IngredientValue.js";
import TagValue from "../domain/catalog/value-objects/TagValue.js";
import type {
  IngredientValueDocument,
  MealDocument,
  PortionDocument,
  TagValueDocument,
} from "./MealModel.js";

export function toDomainTagValue(doc: TagValueDocument): TagValue {
  return new TagValue(doc.title);
}

export function toDomainIngredient(doc: IngredientValueDocument): IngredientValue {
  return new IngredientValue(doc.title, doc.caloriesPerGram, doc.icon);
}

export function toDomainPortion(doc: PortionDocument): Portion {
  return new Portion(toDomainIngredient(doc.ingredient), doc.grams);
}

export function toDomainMeal(doc: Omit<MealDocument, "totalCalories">): Meal {
  const meal = new Meal(
    doc.name,
    toDomainPortion(doc.meatType),
    toDomainPortion(doc.sideType),
  );
  meal.cuisineStyles = doc.cuisineStyles?.map(toDomainTagValue);
  meal.flavorProfiles = doc.flavorProfiles?.map(toDomainTagValue);
  return meal;
}

export function toPersistenceTagValue(tag: TagValue): TagValueDocument {
  return { title: tag.title };
}

export function toPersistencePortion(portion: Portion): PortionDocument {
  const ingredient = portion.getIngredient();
  return {
    ingredient: {
      title: ingredient.title,
      caloriesPerGram: ingredient.caloriesPerGram,
      icon: ingredient.icon,
    },
    grams: portion.grams,
  };
}

export function toPersistenceMeal(meal: Meal): MealDocument {
  return {
    name: meal.name,
    meatType: toPersistencePortion(meal.meatType),
    sideType: toPersistencePortion(meal.sideType),
    cuisineStyles: meal.cuisineStyles?.map(toPersistenceTagValue),
    flavorProfiles: meal.flavorProfiles?.map(toPersistenceTagValue),
    totalCalories: meal.getTotalCalories(),
  };
}
