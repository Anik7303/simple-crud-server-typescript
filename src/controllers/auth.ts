import type { NextFunction, Request, Response } from "express";

import { UserInfo } from "../interfaces/user";
import { getInstance } from "../lib/db";
import { generateHash, verifyHash } from "../lib/hash";
import { formatUserData } from "../lib/utils";

interface LoginRequestData {
  email: string;
  password: string;
}

export async function requestLogin(
  request: Request<null, null, LoginRequestData>,
  response: Response<UserInfo>,
  next: NextFunction
) {
  try {
    const { email, password } = request.body;
    const user = await getInstance().user.findFirst({ where: { email } });
    if (!user) {
      const error = new Error(
        `${email} is not associated with an account.`
      ) as ErrorWithStatusCode;
      error.statusCode = 422;
      throw error;
    }

    const match = await verifyHash(password, user.password);
    if (!match) {
      const error = new Error(`Wrong password`) as ErrorWithStatusCode;
      error.statusCode = 422;
      throw error;
    }
    response.status(200).json(formatUserData(user));
  } catch (error) {
    next(error);
  }
}

interface SignupRequestData {
  name?: string;
  email: string;
  password: string;
}

export async function requestSignup(
  request: Request<null, null, SignupRequestData>,
  response: Response<UserInfo>,
  next: NextFunction
) {
  try {
    const { name, email, password } = request.body;
    const existingUser = await getInstance().user.findFirst({
      where: { email },
    });
    if (existingUser) {
      const error = new Error(
        `${email} is already in use.`
      ) as ErrorWithStatusCode;
      error.statusCode = 422;
      throw error;
    }

    const hash = await generateHash(password);
    const user = await getInstance().user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });
    response.status(201).json(formatUserData(user));
  } catch (error) {
    next(error);
  }
}
