import "dotenv/config";
import mongoose from "mongoose";
import { meatTypes, sideTypes } from "../src/meal/domain/catalog/data.js";
import { MeatTypeModel, SideTypeModel } from "../src/meal/infrastructure/catalog/CatalogModel.js";

async function addPortionSizePerMeal() {
  await mongoose.connect(process.env.MONGO_URI as string);

  let meatUpdated = 0;
  for (const meat of meatTypes) {
    const result = await MeatTypeModel.updateOne(
      { title: meat.title },
      { $set: { portionSizePerMeal: meat.portionSizePerMeal } },
    );
    meatUpdated += result.matchedCount;
  }
  console.log(
    `[addPortionSizePerMeal] updated ${meatUpdated}/${meatTypes.length} meat types`,
  );

  let sideUpdated = 0;
  for (const side of sideTypes) {
    const result = await SideTypeModel.updateOne(
      { title: side.title },
      { $set: { portionSizePerMeal: side.portionSizePerMeal } },
    );
    sideUpdated += result.matchedCount;
  }
  console.log(
    `[addPortionSizePerMeal] updated ${sideUpdated}/${sideTypes.length} side types`,
  );

  await mongoose.disconnect();
}

addPortionSizePerMeal().catch(error => {
  console.error("[addPortionSizePerMeal] failed:", error);
  process.exit(1);
});
