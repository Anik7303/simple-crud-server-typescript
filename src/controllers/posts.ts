import { Post } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import { getInstance } from "../lib/db";
import {
  generateSlugFromTitle,
  throwIfNaN,
  throwIfNotFound,
} from "../lib/utils";

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
    throwIfNaN(id, "invalid post id");

    const post = await getInstance().post.findFirst({
      where: { id: parseInt(id) },
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

interface UpdateRequestParams {
  id: string;
}

interface UpdateRequestBody {
  title?: string;
  content?: string;
  published?: boolean;
}

export async function update(
  request: Request<UpdateRequestParams, null, UpdateRequestBody>,
  response: Response<Post>,
  next: NextFunction
) {
  try {
    const { id } = request.params;
    throwIfNaN(id, "invalid post id");

    const post = await getInstance().post.findFirst({
      where: { id: parseInt(id) },
    });

    throwIfNotFound<Post>(post, "post not found");
    throwIfNotSameAuthor(request.user.id, post!.authorId);

    const { content, published, title } = request.body;
    const data: Partial<Post> = {};
    if (title) data.title = title;
    if (content) data.content = content;
    if (published) data.published = published;

    const updatedPost = await getInstance().post.update({
      data,
      where: { id: post!.id },
    });
    response.status(200).json(updatedPost);
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
    throwIfNaN(id, "invalid post id");

    const post = await getInstance().post.findFirst({
      where: { id: parseInt(id) },
    });
    throwIfNotFound<Post>(post, "post not found");
    throwIfNotSameAuthor(request.user.id, post!.authorId);

    const deletedPost = await getInstance().post.delete({
      where: { id: post!.id },
    });
    response.status(200).json(deletedPost);
  } catch (error) {
    next(error);
  }
}

function throwIfNotSameAuthor(requested: number, expected: number) {
  if (requested !== expected) {
    const error = new Error(
      "You are not authorized to perform this action."
    ) as ErrorWithStatusCode;
    error.statusCode = 422;
    throw error;
  }
}
