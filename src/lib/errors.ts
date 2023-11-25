import type { ErrorWithStatusCode } from "../interfaces/errors";

export function customizeError(message: string, statusCode: number) {
  const error = new Error(message) as ErrorWithStatusCode;
  error.statusCode = statusCode;
  return error;
}

export const notFoundError = (message: string) => customizeError(message, 404);

export const validationError = (message: string) =>
  customizeError(message, 422);
