import { Post } from "../../../generated/prisma/client";
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

//! Export
export const postService = {
  createPost,
}