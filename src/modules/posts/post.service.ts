import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// TODO : Create Post
const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt">) => {
  const result = await prisma.post.create({
    data
  })
  return result;
}

//! Export
export const postService = {
  createPost,
}