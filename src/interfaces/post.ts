export interface FindPostDto {
  id: number;
}

export interface FindPostsDto {
  id?: number;
  title?: string;
  published?: boolean;
  createdAt?: Date;
}

export interface CreatePostDto {
  slug: string;
  title: string;
  content?: string;
  published?: boolean;
  authorId: number;
}

export interface UpdatePostDto {
  id: number;
}

export interface UpdatablePostInfo {
  title: string;
  content?: string;
  published?: boolean;
}

export interface RemovePostDto {
  id: number;
  slug?: string;
}
