import type { Request, Response } from "express";
import type { RegisterUser } from "../application/registerUser.js";
import type { LoginUser } from "../application/loginUser.js";
import { GetMeals } from "../application/getMeals.js";
import { AddMeal } from "../application/addMeal.js";
import { GetUserByUid } from "../application/getUserByUid.js";
import { toDomainMeal } from "../../meal/infrastructure/mealMapper.js";
import type { MealDocument } from "../../meal/infrastructure/MealModel.js";
import { Mood } from "../../meal/domain/value-objects/Mood.js";
import { SubmitQuiz } from "../application/submitQuiz.js";
import { EditMeal } from "../application/editMeal.js";
import { GetMealById } from "../application/getMealById.js";
import { EatMeal } from "../application/eatMeal.js";
import { assertParamsPresent } from "../../shared/errors/assertParamsPresent.js";
import { handleControllerError } from "../../shared/http/handleControllerError.js";

type UserControllerDependencies = {
  registerUser: RegisterUser;
  loginUser: LoginUser;
  getMeals: GetMeals;
  addMeal: AddMeal;
  getUserByUid: GetUserByUid;
  submitQuiz: SubmitQuiz;
  editMeal: EditMeal;
  getMealById: GetMealById;
  eatMeal : EatMeal;
};

export function createUserController({
  registerUser,
  loginUser,
  getMeals,
  addMeal,
  getUserByUid,
  submitQuiz,
  editMeal,
  getMealById,
  eatMeal,
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
        assertParamsPresent({ uid, email });
        const user = await registerUser.execute(uid, email);
        console.log("[userController.register] user created", user);
        res.json(user);
      } catch (error) {
        handleControllerError(error, res);
      }
    },

    async login(req: Request, res: Response) {
      const { uid, email } = req.body;
      try {
        assertParamsPresent({ uid, email });
        const user = await loginUser.execute(uid, email);
        res.json(user);
      } catch (error) {
        handleControllerError(error, res);
      }
    },
    async getUserByUid(req: Request<{ uid: string }>, res: Response) {
      const { uid } = req.params;
      try {
        assertParamsPresent({ uid });
        const user = await getUserByUid.execute(uid);
        res.status(200).json(user);
      } catch (error) {
        handleControllerError(error, res);
      }
    },

    async getMeals(req: Request<{ uid: string }>, res: Response) {
      const { uid } = req.params;
      try {
        assertParamsPresent({ uid });
        const meals = await getMeals.execute(uid);
        res.status(200).json(meals);
      } catch (error) {
        handleControllerError(error, res);
      }
    },

    async getMealById(
      req: Request<{ uid: string; mealId: string }>,
      res: Response,
    ) {
      const { uid, mealId } = req.params;
      try {
        assertParamsPresent({ uid, mealId });
        const meal = await getMealById.execute(uid, mealId);
        res.status(200).json(meal);
      } catch (error) {
        handleControllerError(error, res);
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
        assertParamsPresent({ uid, meal });
        await addMeal.execute(uid, toDomainMeal(meal));
        res.status(204).end();
      } catch (error) {
        handleControllerError(error, res);
      }
    },

    async submitQuiz(
      req: Request<{ uid: string }, unknown, { mood: Mood }>,
      res: Response,
    ) {
      const { mood } = req.body;
      const { uid } = req.params;
      try {
        assertParamsPresent({ uid, mood });
        const response = await submitQuiz.execute(uid, mood);
        res.status(200).json(response);
      } catch (error) {
        handleControllerError(error, res);
      }
    },
    async editMeal(
      req: Request<
        { uid: string },
        unknown,
        { meal: Omit<MealDocument, "totalCalories" | "_id"> & { id: string } }
      >,
      res: Response,
    ) {
      const { uid } = req.params;
      const { meal: editedMeal } = req.body;
      try {
        assertParamsPresent({ uid, meal: editedMeal });
        const meal = toDomainMeal({ ...editedMeal, _id: editedMeal.id });
        await editMeal.execute(uid, meal);
        res.status(200).end();
      } catch (error) {
        handleControllerError(error, res);
      }
    },

    async eatMeal(req: Request<{ uid: string; mealId: string }>, res: Response) {
      const { uid, mealId } = req.params;
      try {
        assertParamsPresent({ uid, mealId });
        await eatMeal.execute(uid, mealId);
        res.status(204).end();
      } catch (error) {
        handleControllerError(error, res);
      }
    },
  };
}
