import { describe, expect, it, vi } from "vitest";
import { createUserController } from "./userController.js";
import { UserNotFoundError } from "../domain/errors/UserNotFoundError.js";
import { MealNotFoundError } from "../domain/errors/MealNotFoundError.js";
import type { EditMeal } from "../application/editMeal.js";
import type { GetMealById } from "../application/getMealById.js";

function fakeRes() {
  return {
    statusCode: undefined as number | undefined,
    body: undefined as unknown,
    ended: false,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
    end() {
      this.ended = true;
      return this;
    },
  };
}

const validMealPayload = {
  id: "652f1f77bcf86cd799439011",
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

function controllerWithEditMeal(execute: EditMeal["execute"]) {
  return createUserController({
    registerUser: {} as never,
    loginUser: {} as never,
    getMeals: {} as never,
    addMeal: {} as never,
    getUserByUid: {} as never,
    submitQuiz: {} as never,
    editMeal: { execute } as unknown as EditMeal,
    getMealById: {} as never,
  });
}

function controllerWithGetMealById(execute: GetMealById["execute"]) {
  return createUserController({
    registerUser: {} as never,
    loginUser: {} as never,
    getMeals: {} as never,
    addMeal: {} as never,
    getUserByUid: {} as never,
    submitQuiz: {} as never,
    editMeal: {} as never,
    getMealById: { execute } as unknown as GetMealById,
  });
}

describe("userController.editMeal", () => {
  it("responds 200 exactly once on a successful edit", async () => {
    const execute = vi.fn().mockResolvedValue(undefined);
    const controller = controllerWithEditMeal(execute);
    const req = { params: { uid: "user-1" }, body: { meal: validMealPayload } };
    const res = fakeRes();

    await controller.editMeal(req as never, res as never);

    expect(execute).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
    expect(res.ended).toBe(true);
  });

  it("responds 404 exactly once, with no follow-on 500, when the user is not found", async () => {
    const execute = vi.fn().mockRejectedValue(new UserNotFoundError("user-1"));
    const controller = controllerWithEditMeal(execute);
    const req = { params: { uid: "user-1" }, body: { meal: validMealPayload } };
    const res = fakeRes();
    const statusCalls: number[] = [];
    const originalStatus = res.status.bind(res);
    res.status = (code: number) => {
      statusCalls.push(code);
      return originalStatus(code);
    };

    await controller.editMeal(req as never, res as never);

    expect(statusCalls).toEqual([404]);
    expect(res.statusCode).toBe(404);
  });
});

describe("userController.getMealById", () => {
  it("responds 200 with the meal on a successful lookup", async () => {
    const execute = vi.fn().mockResolvedValue(validMealPayload);
    const controller = controllerWithGetMealById(execute);
    const req = { params: { uid: "user-1", mealId: validMealPayload.id } };
    const res = fakeRes();

    await controller.getMealById(req as never, res as never);

    expect(execute).toHaveBeenCalledWith("user-1", validMealPayload.id);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(validMealPayload);
  });

  it("responds 404 when the meal is not found in that user's menu", async () => {
    const execute = vi.fn().mockRejectedValue(new MealNotFoundError("missing-id"));
    const controller = controllerWithGetMealById(execute);
    const req = { params: { uid: "user-1", mealId: "missing-id" } };
    const res = fakeRes();

    await controller.getMealById(req as never, res as never);

    expect(res.statusCode).toBe(404);
  });

  it("responds 404 when the uid doesn't exist", async () => {
    const execute = vi.fn().mockRejectedValue(new MealNotFoundError(validMealPayload.id));
    const controller = controllerWithGetMealById(execute);
    const req = { params: { uid: "missing-user", mealId: validMealPayload.id } };
    const res = fakeRes();

    await controller.getMealById(req as never, res as never);

    expect(res.statusCode).toBe(404);
  });
});
