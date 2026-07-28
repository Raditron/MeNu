import type { User } from "../domain/User.js";
import type { UserRepository } from "../domain/UserRepository.js";
import Menu from "../domain/value-objects/Menu.js";
import Meal from "../../meal/domain/value-objects/Meal.js";
import { UserModel } from "./UserModel.js";
import { toDomainMenu, toPersistenceMenu } from "./menuMapper.js";

export class MongooseUserRepository implements UserRepository {
  async findByUId(uid: string): Promise<User | null> {
    const doc = await UserModel.findById(uid);
    return doc
      ? { uid: doc._id, email: doc.email, menu: toDomainMenu(doc.menu) }
      : null;
  }

  async create(uid: string, email: string): Promise<User> {
    const doc = await UserModel.create({
      _id: uid,
      email,
      menu: toPersistenceMenu(new Menu([])),
    });
    return { uid: doc._id, email: doc.email, menu: toDomainMenu(doc.menu) };
  }

  async addToMenu(uid: string, meal: Meal): Promise<void> {
    const user = await UserModel.findById(uid);
    if (!user) {
      throw new Error(`User with uid ${uid} not found`);
    }
    const menu = toDomainMenu(user.menu);
    menu.addMeal(meal);
    user.menu = toPersistenceMenu(menu);
    await user.save();
  }
  async login(uid: string, email: string): Promise<User | null> {
    const user = await UserModel.findOne({ _id: uid, email });
    if (!user) {
      return null;
    }
    return { uid: user._id, email: user.email, menu: toDomainMenu(user.menu) };
  }
  async getMealsByUid(uid: string): Promise<Meal[] | []> {
    const user = await UserModel.findById(uid);
    if (!user) {
      throw new Error(`User with uid ${uid} not found`);
    }
    const menu = toDomainMenu(user.menu);
    return menu.meals;
  }
  async getUserByUid(uid: string): Promise<User | null> {
    const user = await UserModel.findById(uid);
    return user
      ? { uid: user._id, email: user.email, menu: toDomainMenu(user.menu) }
      : null;
  }
}
