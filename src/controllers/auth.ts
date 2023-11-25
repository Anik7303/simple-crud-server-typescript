import type { NextFunction, Request, Response } from "express";
import ms from "ms";

import { validationError } from "../lib/errors";
import { generateHash, verifyHash } from "../lib/hash";
import { generateToken } from "../lib/token";
import * as userService from "../services/user";

interface LoginRequestData {
  email: string;
  password: string;
}

interface ResponseData {
  token: string;
}

export async function requestLogin(
  request: Request<null, null, LoginRequestData>,
  response: Response<ResponseData>,
  next: NextFunction
) {
  try {
    const { email, password } = request.body;
    const user = await userService.find({ email });
    if (!user)
      throw validationError(`${email} is not associated with an account.`);

    const match = await verifyHash(password, user.password);
    if (!match) throw validationError("Wrong password");

    const token = generateToken({ id: user.id });
    response
      .status(200)
      .cookie("token", token, { maxAge: ms("2d") })
      .json({ token });
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
  response: Response<ResponseData>,
  next: NextFunction
) {
  try {
    const { name, email, password } = request.body;
    const existingUser = await userService.find({ email });
    if (existingUser) {
      throw validationError(`${email} is already in use.`);
    }

    const hash = await generateHash(password);
    const user = await userService.create({ name, email, password: hash });
    const token = generateToken({ id: user.id });
    response
      .status(201)
      .cookie("token", token, { maxAge: ms("2d") })
      .json({ token });
  } catch (error) {
    next(error);
  }
}
