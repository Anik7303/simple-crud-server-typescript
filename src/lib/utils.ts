import type { User } from "@prisma/client";

import type { UserInfo } from "../interfaces/user";

export function formatUserData(data: User): UserInfo {
  const { password, ...rest } = data;
  return { ...rest };
}

export function generateSlugFromTitle(title: string): string {
  const time = Date.now();
  const formattedTitle = title.split(" ").join("_").toLowerCase();
  return encodeURI(`${time}_${formattedTitle}`);
}
