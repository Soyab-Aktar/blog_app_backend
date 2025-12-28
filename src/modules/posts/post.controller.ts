import { Request, Response } from "express";
import { postService } from "./post.service";
import { Post } from "../../../generated/prisma/client";

//* Create Posts
const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.createPost(req.body as Omit<Post, "id" | "createdAt" | "updatedAt">)
    res.status(201).json(result)
  } catch (err) {
    res.status(400).json({
      error: "Post Creation Failed",
      details: err,
    })
  }
}

export const postController = {
  createPost,
}