import { Post } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import {
  CreateRequestBody,
  FetchAllRequestQuery,
  FetchAllResponse,
  FetchOneRequestParams,
  RemoveRequestParams,
  UpdatablePostInfo,
  UpdateRequestBody,
  UpdateRequestParams,
} from "../interfaces/post";
import { customizeError, notFoundError } from "../lib/errors";
import { generateSlugFromTitle, throwIfNaN } from "../lib/utils";
import * as postService from "../services/post";

export async function fetchAll(
  request: Request<ParamsDictionary, null, null, FetchAllRequestQuery>,
  response: Response<FetchAllResponse>,
  next: NextFunction
) {
  try {
    const { limit, skip } = request.query;
    const totalPosts = await postService.count();
    const posts = await postService.find({}, limit, skip);
    response.status(200).json({ total: totalPosts, data: posts });
  } catch (error) {
    next(error);
  }
}

export async function fetchOne(
  request: Request<FetchOneRequestParams>,
  response: Response<Post | null>,
  next: NextFunction
) {
  try {
    const { id } = request.params;
    throwIfNaN(id, "invalid post id");

    const post = await postService.findOne(parseInt(id));
    if (!post) throw notFoundError("post not found.");
    response.status(200).json(post);
  } catch (error) {
    next(error);
  }
}

export async function create(
  request: Request<ParamsDictionary, null, CreateRequestBody>,
  response: Response<Post>,
  next: NextFunction
) {
  try {
    const { title, content } = request.body;
    const slug = generateSlugFromTitle(title);
    const post = await postService.create({
      title,
      content,
      slug,
      authorId: request.user.id,
    });
    response.status(201).json(post);
  } catch (error) {
    next(error);
  }
}

export async function update(
  request: Request<UpdateRequestParams, null, UpdateRequestBody>,
  response: Response<Post>,
  next: NextFunction
) {
  try {
    const { id } = request.params;
    throwIfNaN(id, "invalid post id");

    const post = await postService.findOne(parseInt(id));
    if (!post) throw notFoundError("post not found.");
    throwIfNotSameAuthor(request.user.id, post.authorId);

    const { content, published, title } = request.body;
    const data: UpdatablePostInfo = {};
    if (title) data.title = title;
    if (content) data.content = content;
    if (published) data.published = published;

    const updatedPost = await postService.update(post.id, data);
    response.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
}

export async function remove(
  request: Request<RemoveRequestParams>,
  response: Response,
  next: NextFunction
) {
  try {
    const { id } = request.params;
    throwIfNaN(id, "invalid post id");

    const post = await postService.findOne(parseInt(id));
    if (!post) throw notFoundError("Post not found.");
    throwIfNotSameAuthor(request.user.id, post!.authorId);

    const deletedPost = await postService.remove(post.id);
    response.status(200).json(deletedPost);
  } catch (error) {
    next(error);
  }
}

function throwIfNotSameAuthor(requested: number, expected: number) {
  if (requested !== expected) {
    throw customizeError("You are not authorized to perform this action.", 422);
  }
}
