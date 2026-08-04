import { describe, expect, it } from "vitest";
import { toDomainMeal } from "./mealMapper.js";
import Portion from "../domain/value-objects/Portion.js";

describe("toDomainMeal", () => {
  it("reconstructs a JSON-shaped wire payload into a real domain Meal with genuine Portion values", () => {
    const payload = {
      _id: "652f1f77bcf86cd799439011",
      name: "Chicken and rice",
      meatType: {
        ingredientTitle: "chicken",
        grams: 200,
      },
      sideType: {
        ingredientTitle: "rice",
        grams: 150,
      },
      cuisineStyles: [{ title: "asian" }],
      flavorProfiles: [{ title: "savory" }],
    };

    const meal = toDomainMeal(payload);

    expect(meal.id).toBe(payload._id);
    expect(meal.meatType).toBeInstanceOf(Portion);
    expect(meal.sideType).toBeInstanceOf(Portion);
    expect(meal.meatType.getCalories()).toBeCloseTo(200 * 1.9);
    expect(meal.sideType.getCalories()).toBeCloseTo(150 * 1.3);
    expect(meal.getTotalCalories()).toBeCloseTo(200 * 1.9 + 150 * 1.3);
  });

  it("restores eatenHistory from the persisted doc instead of resetting it", () => {
    const date = new Date("2026-01-01T00:00:00.000Z");
    const payload = {
      _id: "652f1f77bcf86cd799439011",
      name: "Chicken and rice",
      meatType: { ingredientTitle: "chicken", grams: 200 },
      sideType: { ingredientTitle: "rice", grams: 150 },
      eatenHistory: [{ date }],
    };

    const meal = toDomainMeal(payload);

    expect(meal.eatenHistory).toEqual([{ date }]);
  });

  it("defaults eatenHistory to an empty array when the doc doesn't carry one", () => {
    const payload = {
      _id: "652f1f77bcf86cd799439011",
      name: "Chicken and rice",
      meatType: { ingredientTitle: "chicken", grams: 200 },
      sideType: { ingredientTitle: "rice", grams: 150 },
    };

    const meal = toDomainMeal(payload as never);

    expect(meal.eatenHistory).toEqual([]);
  });
});
