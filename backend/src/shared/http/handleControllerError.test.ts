import { describe, expect, it, vi } from "vitest";
import { handleControllerError } from "./handleControllerError.js";
import { MissingParamsError } from "../errors/MissingParamsError.js";

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

describe("handleControllerError", () => {
  it("responds with an HttpError's own status code and message", () => {
    const res = fakeRes();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    handleControllerError(new MissingParamsError(["uid"]), res as never);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Missing required parameter(s): uid" });
    expect(warnSpy).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });

  it("responds 500 with a generic message for a non-HttpError, without leaking it", () => {
    const res = fakeRes();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    handleControllerError(new Error("db connection string leaked"), res as never);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Internal Server Error" });
    expect(errorSpy).toHaveBeenCalledTimes(1);
    errorSpy.mockRestore();
  });
});
