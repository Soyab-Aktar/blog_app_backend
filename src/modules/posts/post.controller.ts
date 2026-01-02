import { Request, Response } from "express";
import { postService } from "./post.service";
import { Post } from "../../../generated/prisma/client";
import { error } from "node:console";

//* Create Posts
const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized!!"
      })
    }
    const result = await postService.createPost(req.body, user.id as string)
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