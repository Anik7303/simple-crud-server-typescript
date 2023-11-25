import type { User } from "@prisma/client";

import type { UserInfo } from "../interfaces/user";
import { customizeError } from "./errors";

export function formatUserData(data: User): UserInfo {
  const { password, ...rest } = data;
  return { ...rest };
}

export function generateSlugFromTitle(title: string): string {
  const time = Date.now();
  const formattedTitle = title.split(" ").join("_").toLowerCase();
  return encodeURI(`${time}_${formattedTitle}`);
}

export function throwIfNaN(
  value: string,
  message: string,
  statusCode: number = 422
): void {
  const result = parseInt(value);
  if (isNaN(result)) {
    throw customizeError(message, statusCode);
  }
}
