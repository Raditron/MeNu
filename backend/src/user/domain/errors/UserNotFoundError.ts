import { HttpError } from "../../../shared/errors/HttpError.js";

export class UserNotFoundError extends HttpError {
  readonly statusCode = 404;

  constructor(uid: string) {
    super(`User with uid ${uid} not found`);
    this.name = "UserNotFoundError";
  }
}
