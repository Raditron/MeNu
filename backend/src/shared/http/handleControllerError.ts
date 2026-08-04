import type { Response } from "express";
import { HttpError } from "../errors/HttpError.js";

export function handleControllerError(error: unknown, res: Response): void {
  if (error instanceof HttpError) {
    console.warn(error.message);
    res.status(error.statusCode).json({ error: error.message });
    return;
  }
  console.error(error);
  res.status(500).json({ error: "Internal Server Error" });
}
