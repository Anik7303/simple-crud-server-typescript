import { PrismaClient } from "@prisma/client";

let _instance: PrismaClient | null = null;

export function getInstance() {
  if (!_instance) _instance = new PrismaClient();
  return _instance;
}
