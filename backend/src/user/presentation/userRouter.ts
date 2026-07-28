import { Router } from "express";
import type { createUserController } from "./userController.js";

type UserController = ReturnType<typeof createUserController>;

export function createUserRouter(userController: UserController): Router {
  const router = Router();

  router.post("/users/register", userController.register);
  router.post("/users/login", userController.login);
  router.get("/users/:uid", userController.getUserByUid);
  router.get("/users/:uid/meals", userController.getMeals);
  router.post("/users/:uid/meal", userController.addMeal)
  router.post("/users/:uid/quiz", userController.submitQuiz)
  return router;
}
