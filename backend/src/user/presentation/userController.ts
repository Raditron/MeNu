import type { Request, Response } from "express";
import type { RegisterUser } from "../application/registerUser.js";
import { UserAlreadyExistsError } from "../domain/errors/UserAlreadyExistsError.js";
import type { LoginUser } from "../application/loginUser.js";
import { UserNotFoundError } from "../domain/errors/UserNotFoundError.js";
import { GetMeals } from "../application/getMeals.js";
import { AddMeal } from "../application/addMeal.js";
import { GetUserByUid } from "../application/getUserByUid.js";
import { toDomainMeal } from "../../meal/infrastructure/mealMapper.js";
import type { MealDocument } from "../../meal/infrastructure/MealModel.js";
import { Mood } from "../../meal/domain/value-objects/Mood.js";
import { SubmitQuiz } from "../application/submitQuiz.js";

type UserControllerDependencies = {
  registerUser: RegisterUser;
  loginUser: LoginUser;
  getMeals: GetMeals;
  addMeal: AddMeal;
  getUserByUid: GetUserByUid;
  submitQuiz: SubmitQuiz;
};

export function createUserController({
  registerUser,
  loginUser,
  getMeals,
  addMeal,
  getUserByUid,
  submitQuiz,
}: UserControllerDependencies) {
  return {
    // The `uid` is trusted as-is from the request body — there is no Firebase
    // Admin SDK verification of the token behind it. This is a known, temporary
    // gap, not a design endorsement: anyone can claim any uid until this route
    // verifies a Firebase ID token server-side instead.
    async register(req: Request, res: Response) {
      const { uid, email } = req.body;
      console.log("[userController.register] request received", { uid, email });
      try {
        const user = await registerUser.execute(uid, email);
        console.log("[userController.register] user created", user);
        res.json(user);
      } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
          console.warn("[userController.register] user already exists", {
            uid,
          });
          res.status(409).json({ error: error.message });
          return;
        }
        console.error("Error in register:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },

    async login(req: Request, res: Response) {
      const { uid, email } = req.body;
      try {
        const user = await loginUser.execute(uid, email);
        res.json(user);
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          res.status(404).json({ error: error.message });
          return;
        }
        console.error("Error in login:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },
    async getUserByUid(req: Request<{ uid: string }>, res: Response) {
      const { uid } = req.params;
      try {
        const user = await getUserByUid.execute(uid);
        res.status(200).json(user);
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          res.status(404).json({ error: error.message });
          return;
        }
        console.error("Error getting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },

    async getMeals(req: Request<{ uid: string }>, res: Response) {
      const { uid } = req.params;
      try {
        const meals = await getMeals.execute(uid);
        res.status(200).json(meals);
      } catch (error) {
        console.error("Error getting meals:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },

    async addMeal(
      req: Request<
        { uid: string },
        unknown,
        { meal: Omit<MealDocument, "totalCalories"> }
      >,
      res: Response,
    ) {
      const { meal } = req.body;
      const { uid } = req.params;
      try {
        await addMeal.execute(uid, toDomainMeal(meal));
        res.status(204).end();
      } catch (error) {
        console.error("Error adding meal:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },

    async submitQuiz(
      req: Request<{ uid: string }, unknown, { mood: Mood }>,
      res: Response,
    ) {
      const { mood } = req.body;
      const { uid } = req.params;
      try {
        const response = await submitQuiz.execute(uid, mood);
        res.status(200).json(response);
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          res.status(404).json({ error: error.message });
          return;
        }
        console.error("Error submitting Quiz: ", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },
  };
}
