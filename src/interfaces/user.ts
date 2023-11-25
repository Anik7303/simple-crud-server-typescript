import { Role, User } from "@prisma/client";

export type UserInfo = Omit<Partial<User>, "password">;

export interface CreateUserData {
  name?: string;
  email: string;
  password: string;
  role?: Role;
}
