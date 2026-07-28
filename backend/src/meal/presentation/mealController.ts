import { Request, Response } from "express";
import { GetCatalog } from "../application/getCatalog.js";

type MealControllerDependencies = {
  getCatalog: GetCatalog;
};

export function createMealController({
  getCatalog,
}: MealControllerDependencies) {
  return {
    async getCatalog(_req: Request, res: Response) {
      try {
        const catalog = await getCatalog.execute();
        res.status(200).json(catalog);
      } catch (error) {
        console.error("Error getting Catalog:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },
  };
}
