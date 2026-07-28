import { Router } from "express";
import type { createMealController } from "./mealController.js";

type MealController = ReturnType<typeof createMealController>;

export function createMealRouter(mealController: MealController): Router {
  const router = Router();

  router.get("/catalog", mealController.getCatalog);

  return router;
}
