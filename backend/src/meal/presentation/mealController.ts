import { Request, Response } from "express";
import { GetCatalog } from "../application/getCatalog.js";
import { handleControllerError } from "../../shared/http/handleControllerError.js";

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
        handleControllerError(error, res);
      }
    },
  };
}
