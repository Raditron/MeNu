import type { User } from "../domain/User.js";
import type { UserRepository } from "../domain/UserRepository.js";
import { UserAlreadyExistsError } from "../domain/errors/UserAlreadyExistsError.js";

export class RegisterUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(uid: string, email: string): Promise<User> {
    console.log("[registerUser] checking for existing user", { uid });
    const existing = await this.userRepository.findByUId(uid);
    if (existing) {
      console.log("[registerUser] user already exists", { uid });
      throw new UserAlreadyExistsError(uid);
    }

    console.log("[registerUser] creating user", { uid, email });
    const created = await this.userRepository.create(uid, email);
    console.log("[registerUser] user created", created);
    return created;
  }
}
