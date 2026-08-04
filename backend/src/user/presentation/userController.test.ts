import { describe, expect, it, vi } from "vitest";
import { createUserController } from "./userController.js";
import { UserNotFoundError } from "../domain/errors/UserNotFoundError.js";
import { UserAlreadyExistsError } from "../domain/errors/UserAlreadyExistsError.js";
import { MealNotFoundError } from "../domain/errors/MealNotFoundError.js";

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

function baseDeps() {
  return {
    registerUser: { execute: vi.fn() },
    loginUser: { execute: vi.fn() },
    getMeals: { execute: vi.fn() },
    addMeal: { execute: vi.fn() },
    getUserByUid: { execute: vi.fn() },
    submitQuiz: { execute: vi.fn() },
    editMeal: { execute: vi.fn() },
    getMealById: { execute: vi.fn() },
    eatMeal: { execute: vi.fn() },
  };
}

function buildController(overrides: Partial<ReturnType<typeof baseDeps>> = {}) {
  return createUserController({ ...baseDeps(), ...overrides } as never);
}

describe("userController missing params", () => {
  it("responds 400 when a single required param is missing", async () => {
    const controller = buildController();
    const req = { body: { uid: "user-1", email: "" } };
    const res = fakeRes();

    await controller.register(req as never, res as never);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: "Missing required parameter(s): email",
    });
  });

  it("responds 400 listing every missing param when several are absent", async () => {
    const controller = buildController();
    const req = { body: { uid: undefined, email: undefined } };
    const res = fakeRes();

    await controller.register(req as never, res as never);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: "Missing required parameter(s): uid, email",
    });
  });
});

describe("userController mapped domain errors", () => {
  it("responds 409 when registering a user that already exists", async () => {
    const registerUser = {
      execute: vi.fn().mockRejectedValue(new UserAlreadyExistsError("user-1")),
    };
    const controller = buildController({ registerUser });
    const req = { body: { uid: "user-1", email: "a@b.com" } };
    const res = fakeRes();

    await controller.register(req as never, res as never);

    expect(res.statusCode).toBe(409);
    expect(res.body).toEqual({
      error: "User with uid user-1 already exists",
    });
  });

  it("responds 404 when logging in a user that isn't found", async () => {
    const loginUser = {
      execute: vi.fn().mockRejectedValue(new UserNotFoundError("user-1")),
    };
    const controller = buildController({ loginUser });
    const req = { body: { uid: "user-1", email: "a@b.com" } };
    const res = fakeRes();

    await controller.login(req as never, res as never);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "User with uid user-1 not found" });
  });

  it("responds 404 when the requested meal isn't found", async () => {
    const getMealById = {
      execute: vi.fn().mockRejectedValue(new MealNotFoundError("missing-id")),
    };
    const controller = buildController({ getMealById });
    const req = { params: { uid: "user-1", mealId: "missing-id" } };
    const res = fakeRes();

    await controller.getMealById(req as never, res as never);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Meal with id missing-id not found" });
  });
});

describe("userController unmapped errors", () => {
  it("responds 500 with a generic message, without leaking the raw error", async () => {
    const getMeals = {
      execute: vi.fn().mockRejectedValue(new Error("db connection string leaked")),
    };
    const controller = buildController({ getMeals });
    const req = { params: { uid: "user-1" } };
    const res = fakeRes();

    await controller.getMeals(req as never, res as never);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Internal Server Error" });
  });
});

describe("userController.editMeal", () => {
  it("responds 200 exactly once on a successful edit", async () => {
    const execute = vi.fn().mockResolvedValue(undefined);
    const controller = buildController({ editMeal: { execute } });
    const req = { params: { uid: "user-1" }, body: { meal: validMealPayload } };
    const res = fakeRes();

    await controller.editMeal(req as never, res as never);

    expect(execute).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
    expect(res.ended).toBe(true);
  });

  it("responds 404 exactly once, with no follow-on 500, when the user is not found", async () => {
    const execute = vi.fn().mockRejectedValue(new UserNotFoundError("user-1"));
    const controller = buildController({ editMeal: { execute } });
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
    const controller = buildController({ getMealById: { execute } });
    const req = { params: { uid: "user-1", mealId: validMealPayload.id } };
    const res = fakeRes();

    await controller.getMealById(req as never, res as never);

    expect(execute).toHaveBeenCalledWith("user-1", validMealPayload.id);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(validMealPayload);
  });

  it("responds 404 when the meal is not found in that user's menu", async () => {
    const execute = vi.fn().mockRejectedValue(new MealNotFoundError("missing-id"));
    const controller = buildController({ getMealById: { execute } });
    const req = { params: { uid: "user-1", mealId: "missing-id" } };
    const res = fakeRes();

    await controller.getMealById(req as never, res as never);

    expect(res.statusCode).toBe(404);
  });

  it("responds 404 when the uid doesn't exist", async () => {
    const execute = vi.fn().mockRejectedValue(new MealNotFoundError(validMealPayload.id));
    const controller = buildController({ getMealById: { execute } });
    const req = { params: { uid: "missing-user", mealId: validMealPayload.id } };
    const res = fakeRes();

    await controller.getMealById(req as never, res as never);

    expect(res.statusCode).toBe(404);
  });
});

describe("userController.eatMeal", () => {
  it("responds 204 on a successful eat", async () => {
    const execute = vi.fn().mockResolvedValue(undefined);
    const controller = buildController({ eatMeal: { execute } });
    const req = { params: { uid: "user-1", mealId: validMealPayload.id } };
    const res = fakeRes();

    await controller.eatMeal(req as never, res as never);

    expect(execute).toHaveBeenCalledWith("user-1", validMealPayload.id);
    expect(res.statusCode).toBe(204);
    expect(res.ended).toBe(true);
    expect(res.body).toBeUndefined();
  });

  it("responds 400 when mealId is missing", async () => {
    const execute = vi.fn();
    const controller = buildController({ eatMeal: { execute } });
    const req = { params: { uid: "user-1", mealId: "" } };
    const res = fakeRes();

    await controller.eatMeal(req as never, res as never);

    expect(execute).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: "Missing required parameter(s): mealId",
    });
  });
});
