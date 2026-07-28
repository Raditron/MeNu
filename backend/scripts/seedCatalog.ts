import "dotenv/config";
import mongoose from "mongoose";
import {
  meatTypes,
  sideTypes,
  cuisineStyles,
  flavorProfiles,
} from "../src/meal/domain/catalog/data.js";
import {
  MeatTypeModel,
  SideTypeModel,
  CuisineStyleModel,
  FlavorProfileModel,
} from "../src/meal/infrastructure/catalog/CatalogModel.js";

async function seed() {
  await mongoose.connect(process.env.MONGO_URI as string);

  await MeatTypeModel.deleteMany({});
  await MeatTypeModel.insertMany(
    meatTypes.map(m => ({ title: m.title, caloriesPerGram: m.caloriesPerGram, icon: m.icon })),
  );
  console.log(`[seedCatalog] seeded ${meatTypes.length} meat types`);

  await SideTypeModel.deleteMany({});
  await SideTypeModel.insertMany(
    sideTypes.map(s => ({ title: s.title, caloriesPerGram: s.caloriesPerGram, icon: s.icon })),
  );
  console.log(`[seedCatalog] seeded ${sideTypes.length} side types`);

  await CuisineStyleModel.deleteMany({});
  await CuisineStyleModel.insertMany(cuisineStyles.map(c => ({ title: c.title })));
  console.log(`[seedCatalog] seeded ${cuisineStyles.length} cuisine styles`);

  await FlavorProfileModel.deleteMany({});
  await FlavorProfileModel.insertMany(flavorProfiles.map(f => ({ title: f.title })));
  console.log(`[seedCatalog] seeded ${flavorProfiles.length} flavor profiles`);

  await mongoose.disconnect();
}

seed().catch(error => {
  console.error("[seedCatalog] failed:", error);
  process.exit(1);
});
