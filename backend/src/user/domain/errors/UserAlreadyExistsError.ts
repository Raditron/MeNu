import { HttpError } from "../../../shared/errors/HttpError.js";

export class UserAlreadyExistsError extends HttpError {
  readonly statusCode = 409;

  constructor(uid: string) {
    super(`User with uid ${uid} already exists`);
    this.name = "UserAlreadyExistsError";
  }
}
