import { NextFunction, Request, Response } from "express";

import { ErrorWithStatusCode } from "../interfaces/errors";

export function notFound(
  request: Request,
  response: Response,
  _next: NextFunction
) {
  const { method, url } = request;
  const message = `${method.toUpperCase()} ${url} not found.`;
  response.status(404).json({
    statusCode: 404,
    message,
    method,
    url,
  });
}

export function catchAllError(
  error: ErrorWithStatusCode,
  request: Request,
  response: Response,
  _next: NextFunction
) {
  const { method, url } = request;
  const message = error.message || "An unexpected error occured.";
  const statusCode = error.statusCode || 500;
  response.status(statusCode).json({
    message,
    method,
    statusCode,
    url,
  });
}
