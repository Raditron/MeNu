import { MongooseUserRepository } from "./user/infrastructure/MongooseUserRepository.js";
import { RegisterUser } from "./user/application/registerUser.js";
import { LoginUser } from "./user/application/loginUser.js";
import { GetMeals } from "./user/application/getMeals.js";
import { AddMeal } from "./user/application/addMeal.js";
import { GetUserByUid } from "./user/application/getUserByUid.js";
import { SubmitQuiz } from "./user/application/submitQuiz.js";
import { EditMeal } from "./user/application/editMeal.js";
import { GetMealById } from "./user/application/getMealById.js";
import { createUserController } from "./user/presentation/userController.js";
import { createUserRouter } from "./user/presentation/userRouter.js";

import { MongooseCatalogRepository } from "./meal/infrastructure/catalog/MongooseCatalogRepository.js";
import { GetCatalog } from "./meal/application/getCatalog.js";
import { createMealController } from "./meal/presentation/mealController.js";
import { createMealRouter } from "./meal/presentation/mealRouter.js";

export function buildApp() {
  const userRepository = new MongooseUserRepository();
  const userController = createUserController({
    registerUser: new RegisterUser(userRepository),
    loginUser: new LoginUser(userRepository),
    getMeals: new GetMeals(userRepository),
    addMeal: new AddMeal(userRepository),
    getUserByUid: new GetUserByUid(userRepository),
    submitQuiz: new SubmitQuiz(userRepository),
    editMeal: new EditMeal(userRepository),
    getMealById: new GetMealById(userRepository),
  });
  const userRouter = createUserRouter(userController);

  const catalogRepository = new MongooseCatalogRepository();
  const mealController = createMealController({
    getCatalog: new GetCatalog(catalogRepository),
  });
  const mealRouter = createMealRouter(mealController);

  return { userRouter, mealRouter };
}
