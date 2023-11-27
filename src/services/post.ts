import { Post, Prisma } from "@prisma/client";

import {
  CreatePostDto,
  PostOrderBy,
  UpdatablePostInfo,
} from "../interfaces/post";
import { getInstance } from "../lib/db";

export const count = async () => getInstance().post.count();

export const findOne = async (id: number): Promise<Post | null> =>
  getInstance().post.findFirst({
    where: { id },
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

export const find = async (
  query: Prisma.PostWhereInput,
  limit: number = 30,
  skip: number = 0,
  orderBy: PostOrderBy = [{ createdAt: "desc" }, { title: "desc" }]
): Promise<Post[]> =>
  getInstance().post.findMany({
    where: query,
    take: limit,
    skip,
    orderBy: orderBy,
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

export const create = async (data: CreatePostDto): Promise<Post> =>
  getInstance().post.create({ data });

export const update = async (
  id: number,
  data: UpdatablePostInfo
): Promise<Post> => getInstance().post.update({ data, where: { id } });

export const remove = async (id: number): Promise<Post> =>
  getInstance().post.delete({ where: { id } });
