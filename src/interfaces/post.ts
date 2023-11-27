import { Post, Prisma } from "@prisma/client";

export type PostOrderBy =
  | Prisma.PostOrderByWithRelationInput
  | Prisma.PostOrderByWithRelationInput[];

export interface FetchAllRequestQuery {
  limit?: number;
  skip?: number;
}

export interface FetchAllResponse {
  total: number;
  data: Post[];
  next?: string;
  previous?: string;
}

export interface FetchOneRequestParams {
  id: string;
}

export interface CreateRequestBody {
  title: string;
  content?: string;
}

export interface UpdateRequestParams {
  id: string;
}

export interface UpdateRequestBody {
  title?: string;
  content?: string;
  published?: boolean;
}

export interface RemoveRequestParams {
  id: string;
}

export interface CreatePostDto {
  slug: string;
  title: string;
  content?: string;
  published?: boolean;
  authorId: number;
}

export interface UpdatablePostInfo {
  title?: string;
  content?: string;
  published?: boolean;
}
