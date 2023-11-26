import type { User } from "@prisma/client";

import { CreateUserData, FindUserDto } from "../interfaces/user";
import { getInstance } from "../lib/db";

export const find = async ({ id, email }: FindUserDto): Promise<User | null> =>
  getInstance().user.findFirst({ where: { id, email } });

export const create = async (data: CreateUserData): Promise<User> =>
  getInstance().user.create({ data });
