import { Types } from "mongoose";
import Meal from "../domain/entities/Meal.js";
import Portion from "../domain/value-objects/Portion.js";
import { IngredientValue } from "../domain/catalog/value-objects/IngredientValue.js";
import { findMeatType, findSideType } from "../domain/catalog/data.js";
import TagValue from "../domain/catalog/value-objects/TagValue.js";
import type { MealDocument, PortionDocument, TagValueDocument } from "./MealModel.js";

export function toDomainTagValue(doc: TagValueDocument): TagValue {
  return new TagValue(doc.title);
}

export function toDomainPortion(
  doc: PortionDocument,
  lookup: (title: string) => IngredientValue,
): Portion {
  return new Portion(lookup(doc.ingredientTitle), doc.grams);
}

// `_id` accepts a string as well as a real ObjectId because this mapper
// serves two callers: real Mongoose subdocuments (via menuMapper) and
// plain JSON request bodies reconstructed by the add/edit-Meal handlers.
export function toDomainMeal(
  doc: Omit<MealDocument, "totalCalories" | "_id"> & {
    _id?: Types.ObjectId | string;
  },
): Meal {
  const meal = new Meal(
    doc.name,
    toDomainPortion(doc.meatType, findMeatType),
    toDomainPortion(doc.sideType, findSideType),
    doc._id?.toString(),
    doc.youtubeURL,
    
  );
  meal.cuisineStyles = doc.cuisineStyles?.map(toDomainTagValue);
  meal.flavorProfiles = doc.flavorProfiles?.map(toDomainTagValue);
  
  return meal;
}

export function toPersistenceTagValue(tag: TagValue): TagValueDocument {
  return { title: tag.title };
}

export function toPersistencePortion(portion: Portion): PortionDocument {
  return {
    ingredientTitle: portion.getIngredient().title,
    grams: portion.grams,
  };
}

export function toPersistenceMeal(meal: Meal): MealDocument {
  return {
    ...(meal.id ? { _id: new Types.ObjectId(meal.id) } : {}),
    name: meal.name,
    meatType: toPersistencePortion(meal.meatType),
    sideType: toPersistencePortion(meal.sideType),
    cuisineStyles: meal.cuisineStyles?.map(toPersistenceTagValue),
    flavorProfiles: meal.flavorProfiles?.map(toPersistenceTagValue),
    totalCalories: meal.getTotalCalories(),
    youtubeURL: meal.youtubeURL,
    calPerPortion: meal.getCalPerPortion(),
  };
}
