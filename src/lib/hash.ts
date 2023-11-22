import { randomBytes, scrypt } from "node:crypto";

const SALT_LENGTH = 16;
const HASH_LENGTH = 20;

export async function generateHash(content: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      const salt = randomBytes(SALT_LENGTH).toString("hex");
      scrypt(content, salt, HASH_LENGTH, (error, derivedKey) => {
        if (error) reject(error);
        const hash = derivedKey.toString("hex");
        const result = `${salt}${hash}`;
        resolve(result);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function verifyHash(
  content: string,
  hash: string
): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const salt = hash.slice(0, SALT_LENGTH * 2);
    const key = hash.slice(SALT_LENGTH * 2);
    scrypt(content, salt, HASH_LENGTH, (error, derivedKey) => {
      if (error) reject(error);
      const newHash = derivedKey.toString("hex");
      const result = key === newHash;
      resolve(result);
    });
  });
}
