import "dotenv/config";
import mongoose from "mongoose";

interface LegacyPortion {
  ingredient?: { title: string };
  ingredientTitle?: string;
  grams: number;
}

interface LegacyMeal {
  meatType: LegacyPortion;
  sideType: LegacyPortion;
  [key: string]: unknown;
}

interface LegacyUser {
  _id: string;
  menu: { meals: LegacyMeal[] };
}

function migratePortion(portion: LegacyPortion): LegacyPortion {
  if (!portion.ingredient) return portion;
  return { ingredientTitle: portion.ingredient.title, grams: portion.grams };
}

async function migratePortionToIngredientTitle() {
  await mongoose.connect(process.env.MONGO_URI as string);
  const users = mongoose.connection.collection<LegacyUser>("users");

  const cursor = users.find({
    $or: [
      { "menu.meals.meatType.ingredient": { $exists: true } },
      { "menu.meals.sideType.ingredient": { $exists: true } },
    ],
  });

  let updated = 0;
  for await (const user of cursor) {
    const meals = user.menu.meals.map(meal => ({
      ...meal,
      meatType: migratePortion(meal.meatType),
      sideType: migratePortion(meal.sideType),
    }));

    await users.updateOne({ _id: user._id }, { $set: { "menu.meals": meals } });
    updated++;
  }

  console.log(`[migratePortionToIngredientTitle] updated ${updated} users`);
  await mongoose.disconnect();
}

migratePortionToIngredientTitle().catch(error => {
  console.error("[migratePortionToIngredientTitle] failed:", error);
  process.exit(1);
});
