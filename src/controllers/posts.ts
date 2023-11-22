import { Post } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

import { getInstance } from "../lib/db";

interface FetchAllQueries {
  limit?: number;
  skip?: number;
}

interface FetchAllResponse {
  total: number;
  data: Post[];
  next?: string;
  previous?: string;
}

export async function fetchAll(
  request: Request<null, null, null, FetchAllQueries>,
  response: Response<FetchAllResponse>,
  next: NextFunction
) {
  try {
    const { limit, skip } = request.query;
    const totalPosts = await getInstance().post.count();
    const posts = await getInstance().post.findMany({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    });
    response.status(200).json({ total: totalPosts, data: posts });
  } catch (error) {
    next(error);
  }
}

interface FetchOneParams {
  id: string;
}

export async function fetchOne(
  request: Request<FetchOneParams>,
  response: Response<Post | null>,
  next: NextFunction
) {
  try {
    const { id } = request.params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      const error = new Error("invalid post id") as ErrorWithStatusCode;
      error.statusCode = 422;
      throw error;
    }

    const post = await getInstance().post.findFirst({
      where: { id: userId },
    });
    response.status(200).json(post);
  } catch (error) {
    next(error);
  }
}
