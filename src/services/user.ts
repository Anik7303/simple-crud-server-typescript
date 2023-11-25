import type { User } from "@prisma/client";

import type { CreateUserData } from "../interfaces/user";
import { getInstance } from "../lib/db";

interface FindProps {
  id?: number;
  email?: string;
}

export const find = async ({ id, email }: FindProps): Promise<User | null> =>
  getInstance().user.findFirst({ where: { id, email } });

export const create = async (data: CreateUserData): Promise<User> =>
  getInstance().user.create({ data });
