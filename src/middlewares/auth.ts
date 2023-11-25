import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";

import { customizeError } from "../lib/errors";
import { verifyToken } from "../lib/token";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
      };
    }
  }
}

export async function requireAuth(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const { cookies, headers } = request;
  const header = headers["authorization"];
  const cookie = cookies["token"];
  let payload: JwtPayload | string | null = null;

  try {
    if (header) {
      const [_type, token] = header.split(" ");
      payload = verifyToken(token);
    } else if (cookie) {
      payload = verifyToken(cookie);
    }

    if (!payload) {
      throw customizeError("Authorization failed!", 401);
    }

    if (typeof payload !== "string") {
      request.user = {
        id: payload.id,
      };
    } else {
      throw new Error("invalid token");
    }
    next();
  } catch (error) {
    next(error);
  }
}
