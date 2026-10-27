import { ApiError } from "@/lib/api/localGuard";

export function textField(value: unknown, name: string, max: number, optional = false, allowEmpty = false): string | undefined {
  if (value === undefined && optional) return undefined;
  if (typeof value !== "string" || value.length > max || (!allowEmpty && !value.trim())) throw new ApiError(400, "INVALID_INPUT", `${name} must be a string of at most ${max} characters.`);
  return value;
}
export function contentId(value: unknown, optional = true): string | undefined {
  const id = textField(value, "id", 100, optional);
  if (id && !/^[a-zA-Z0-9_-]+$/.test(id)) throw new ApiError(400, "INVALID_INPUT", "Invalid content ID.");
  return id;
}
export function booleanField(value: unknown): boolean | undefined {
  if (value !== undefined && typeof value !== "boolean") throw new ApiError(400, "INVALID_INPUT", "isDefault must be a boolean.");
  return value as boolean | undefined;
}
export function problemIdField(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) throw new ApiError(400, "INVALID_INPUT", "problemId must be a positive integer.");
  return value;
}
