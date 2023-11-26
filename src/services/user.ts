import type { Role, User } from "@prisma/client";

import { getInstance } from "../lib/db";

interface FindUserDto {
  id?: number;
  email?: string;
}

interface CreateUserData {
  name?: string;
  email: string;
  password: string;
  role?: Role;
}

export const find = async ({ id, email }: FindUserDto): Promise<User | null> =>
  getInstance().user.findFirst({ where: { id, email } });

export const create = async (data: CreateUserData): Promise<User> =>
  getInstance().user.create({ data });
