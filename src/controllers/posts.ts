import { Post } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import { getInstance } from "../lib/db";
import { generateSlugFromTitle } from "../lib/utils";

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
  request: Request<ParamsDictionary, null, null, FetchAllQueries>,
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
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    response.status(200).json(post);
  } catch (error) {
    next(error);
  }
}

interface CreateRequestBody {
  title: string;
  content?: string;
}

export async function create(
  request: Request<ParamsDictionary, null, CreateRequestBody>,
  response: Response<Post>,
  next: NextFunction
) {
  try {
    const { title, content } = request.body;
    const slug = generateSlugFromTitle(title);
    const post = await getInstance().post.create({
      data: {
        title,
        content,
        slug,
        authorId: request.user.id,
      },
    });
    response.status(201).json(post);
  } catch (error) {
    next(error);
  }
}

interface RemoveParams {
  id: string;
}

export async function remove(
  request: Request<RemoveParams>,
  response: Response,
  next: NextFunction
) {
  try {
    const { id } = request.params;
    const postId = parseInt(id);
    if (isNaN(postId)) {
      const error = new Error("invalid post id") as ErrorWithStatusCode;
      error.statusCode = 422;
      throw error;
    }

    const post = await getInstance().post.findFirst({ where: { id: postId } });

    if (!post) {
      const error = new Error("post not found") as ErrorWithStatusCode;
      error.statusCode = 404;
      throw error;
    }
    if (post.authorId !== request.user.id) {
      const error = new Error(
        "you cannot delete this post."
      ) as ErrorWithStatusCode;
      error.statusCode = 422;
      throw error;
    }

    const deletedPost = await getInstance().post.delete({
      where: { id: postId },
    });
    response.status(200).json(deletedPost);
  } catch (error) {
    next(error);
  }
}
