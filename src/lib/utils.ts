import type { User } from "@prisma/client";

import type { UserInfo } from "../interfaces/user";

export function formatUserData(data: User): UserInfo {
  const { password, ...rest } = data;
  return { ...rest };
}
