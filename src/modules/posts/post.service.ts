import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

// TODO : Create Post
const createPost = async (data: Omit<Post, "id" | "createdAt" | "authorId">, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId
    }
  })
  return result;
}
// TODO : Get All Posts
const getAllPosts = async (payload: {
  search: string | undefined,
  tags: string[] | [],
  isFeatured: boolean | undefined,
  status: PostStatus | undefined,
  authorId: string | undefined,
  page: number,
  limit: number,
  skip: number,
  sortBy: string | undefined,
  sortOrder: string | undefined,
}) => {
  const andConditions: PostWhereInput[] = [];
  if (payload.search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: payload.search as string,
            mode: 'insensitive'
          }
        },
        {
          content: {
            contains: payload.search as string,
            mode: 'insensitive'
          }
        },
        {
          tags: {
            has: payload.search as string
          }
        }
      ]
    })
  }

  if (payload.tags.length > 0) {
    andConditions.push({
      tags: {
        hasEvery: payload.tags as string[]
      }
    })
  }

  if (typeof (payload.isFeatured) === 'boolean') {
    andConditions.push({
      isFeatured: payload.isFeatured
    })
  }

  if (payload.status) {
    andConditions.push({
      status: payload.status
    })
  }

  if (payload.authorId) {
    andConditions.push({
      authorId: payload.authorId
    })
  }


  const allPosts = await prisma.post.findMany({
    take: payload.limit,
    skip: payload.skip,
    where: {
      AND: andConditions
    },
    orderBy: payload.sortBy && payload.sortOrder ? {
      [payload.sortBy]: payload.sortOrder
    } : { createdAt: "desc" }
  });
  return allPosts;
}

//! Export
export const postService = {
  createPost, getAllPosts
}