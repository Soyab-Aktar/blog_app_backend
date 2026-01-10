import { Request, Response } from "express";
import { postService } from "./post.service";
import { Post, PostStatus } from "../../../generated/prisma/client";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middleware/authMiddleware";


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

//* Get all Posts
const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const searchString = typeof search === 'string' ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(',') : [];
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === 'true'
        ? true : req.query.isFeatured === 'false'
          ? false
          : undefined
      : undefined;
    const status = req.query.status as PostStatus | undefined;
    const authorId = req.query.authorId as string | undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);


    const result = await postService.getAllPosts({ search: searchString, tags, isFeatured, status, authorId, page, limit, skip, sortBy, sortOrder });
    res.status(200).json({
      success: true,
      data: result
    })
  } catch (err) {
    res.status(400).json({
      error: "Post Creation Failed",
      details: err,
    })
  }
}

//* Get Post By ID
const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw new Error("Post ID is required")
    }
    const result = await postService.getPostById(postId);
    res.status(200).json({
      result: result,
    })

  } catch (err) {
    res.status(400).json({
      error: "Post Retrive Failed",
      details: err,
    })
  }
}
//* Get Post mine
const getMyPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error('User Not found')
    }

    const result = await postService.getMyPost(user?.id as string);
    res.status(200).json({
      success: true,
      result: result
    })

  } catch (err) {
    res.status(400).json({
      error: "Posts Retrive Failed",
      details: err,
    })
  }
}
//* Update Posts
const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error('You are not authorized')
    }

    const { postId } = req.params;
    const isAdmin = user.role === UserRole.ADMIN;

    const result = await postService.updatePost(postId as string, req.body, user?.id as string, isAdmin as boolean);
    res.status(200).json({
      success: true,
      result: result
    })

  } catch (err) {
    res.status(400).json({
      error: "Posts Update Failed",
      details: err,
    })
  }
}
//* Delete Posts
const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error('You are not authorized')
    }

    const { postId } = req.params;
    const isAdmin = user.role === UserRole.ADMIN;

    const result = await postService.deletePost(postId as string, req.body, user?.id as string, isAdmin as boolean);
    res.status(200).json({
      success: true,
      result: result
    })

  } catch (err) {
    res.status(400).json({
      error: "Posts Delete Failed",
      details: err,
    })
  }
}
//* Get Stats 
const getStats = async (req: Request, res: Response) => {
  try {

    const result = await postService.getStats();
    console.log({ result });
    res.status(200).json({
      success: true,
      result: result
    })

  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Posts Stats retrive Failed",
    })
  }
}

export const postController = {
  createPost, getAllPosts, getPostById, getMyPost, updatePost, deletePost, getStats
}