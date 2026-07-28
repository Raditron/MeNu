export class UserAlreadyExistsError extends Error {
  constructor(uid: string) {
    super(`User with uid ${uid} already exists`);
    this.name = "UserAlreadyExistsError";
  }
}
