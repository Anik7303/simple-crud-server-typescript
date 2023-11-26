import type { Post } from "@prisma/client";

import {
  CreatePostDto,
  FindPostDto,
  FindPostsDto,
  RemovePostDto,
  UpdatablePostInfo,
  UpdatePostDto,
} from "../interfaces/post";
import { getInstance } from "../lib/db";

export const findOne = async (query: FindPostDto): Promise<Post | null> =>
  getInstance().post.findFirst({ where: query });

export const find = async (
  query: FindPostsDto,
  limit: number = 30,
  skip?: number
): Promise<Post[]> =>
  getInstance().post.findMany({
    where: query,
    orderBy: [{ createdAt: "desc", title: "desc" }],
    take: limit,
    skip,
  });

export const create = async (data: CreatePostDto): Promise<Post> =>
  getInstance().post.create({
    data,
  });

export const update = async (
  query: UpdatePostDto,
  data: UpdatablePostInfo
): Promise<Post> =>
  getInstance().post.update({
    data,
    where: query,
  });

export const remove = async (query: RemovePostDto): Promise<Post> =>
  getInstance().post.delete({
    where: query,
  });
