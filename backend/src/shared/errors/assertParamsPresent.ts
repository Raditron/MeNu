import { MissingParamsError } from "./MissingParamsError.js";

function isMissing(value: unknown): boolean {
  if (value === undefined || value === null || value === "") {
    return true;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.keys(value).length === 0;
  }
  return false;
}

export function assertParamsPresent(params: Record<string, unknown>): void {
  const missing = Object.keys(params).filter((key) => isMissing(params[key]));
  if (missing.length > 0) {
    throw new MissingParamsError(missing);
  }
}
