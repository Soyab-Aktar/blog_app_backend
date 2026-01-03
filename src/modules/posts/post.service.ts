import { Post } from "../../../generated/prisma/client";
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
const getAllPosts = async (payload: { search: string | undefined, tags: string[] | [] }) => {
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

  const allPosts = await prisma.post.findMany({
    where: {
      AND: andConditions
    }
  });
  return allPosts;
}

//! Export
export const postService = {
  createPost, getAllPosts
}