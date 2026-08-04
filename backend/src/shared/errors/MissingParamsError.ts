import { HttpError } from "./HttpError.js";

export class MissingParamsError extends HttpError {
  readonly statusCode = 400;

  constructor(paramNames: string[]) {
    super(`Missing required parameter(s): ${paramNames.join(", ")}`);
    this.name = "MissingParamsError";
  }
}
