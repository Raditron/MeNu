import { describe, expect, it, vi } from "vitest";
import { createMealController } from "./mealController.js";

function fakeRes() {
  return {
    statusCode: undefined as number | undefined,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
}

describe("mealController.getCatalog", () => {
  it("responds 500 with a generic message, without leaking the raw error", async () => {
    const getCatalog = {
      execute: vi.fn().mockRejectedValue(new Error("db connection string leaked")),
    };
    const controller = createMealController({ getCatalog } as never);
    const req = {};
    const res = fakeRes();

    await controller.getCatalog(req as never, res as never);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Internal Server Error" });
  });
});
