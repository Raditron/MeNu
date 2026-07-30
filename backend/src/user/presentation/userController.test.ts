import { describe, expect, it, vi } from "vitest";
import { createUserController } from "./userController.js";
import { UserNotFoundError } from "../domain/errors/UserNotFoundError.js";
import type { EditMeal } from "../application/editMeal.js";

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
  meatType: { ingredient: { title: "chicken", caloriesPerGram: 1.9, icon: "GiChicken" }, grams: 200 },
  sideType: { ingredient: { title: "rice", caloriesPerGram: 1.3, icon: "GiBowlOfRice" }, grams: 150 },
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
