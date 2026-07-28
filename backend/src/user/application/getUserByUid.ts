import { User } from "../domain/User.js";
import { UserNotFoundError } from "../domain/errors/UserNotFoundError.js";
import { UserRepository } from "../domain/UserRepository.js";

export class GetUserByUid {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(uid: string): Promise<User> {
    const user = await this.userRepository.getUserByUid(uid);
    if (!user) {
      throw new UserNotFoundError(uid);
    }
    return user;
  }
}
