export class UserNotFoundError extends Error {
  constructor(uid: string) {
    super(`User with uid ${uid} not found`);
    this.name = "UserNotFoundError";
  }
}
