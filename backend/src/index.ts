import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { buildApp } from "./composition.js";

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[server] ${req.method} ${req.url}`);
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const { userRouter, mealRouter } = buildApp();
app.use("/api", userRouter);
app.use("/api", mealRouter);

async function start() {
  await mongoose.connect(process.env.MONGO_URI as string);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

start();
