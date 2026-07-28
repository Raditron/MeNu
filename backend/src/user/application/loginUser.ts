import { User } from "../domain/User.js";
import { UserNotFoundError } from "../domain/errors/UserNotFoundError.js";
import { UserRepository } from "../domain/UserRepository.js";

export class LoginUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(uid: string, email: string): Promise<User> {
    const user = await this.userRepository.login(uid, email);
    if (!user) {
      throw new UserNotFoundError(uid);
    }
    return user;
  }
}
