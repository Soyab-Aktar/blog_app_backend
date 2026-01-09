import { date, success } from "better-auth/*";
import { Request, Response } from "express";
import { commentService } from "./comment.service";

//! Create comment
const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;

    const result = await commentService.createComment(req.body);
    res.status(201).json({
      success: true,
      data: result
    })

  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Comment Creation Failed",
      details: err
    })
  }
}
//! Get Comment By ID
const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params

    const result = await commentService.getCommentById(commentId as string);
    res.status(200).json({
      success: true,
      date: result
    })

  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Comment Not Retrived",
      details: err
    })
  }
}
//! Get Comment By Author ID
const getCommentByAuthorId = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params

    const result = await commentService.getCommentByAuthorId(authorId as string);
    res.status(200).json({
      success: true,
      date: result
    })

  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Author Comments Not Retrived",
      details: err
    })
  }
}
//! Delete Comment
const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params

    const result = await commentService.deleteComment(user?.id as string, commentId as string);
    res.status(200).json({
      success: true,
      date: result
    })

  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Delete Process Not completed",
      details: err
    })
  }
}
//! Update Comment
const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params

    const result = await commentService.updateComment(user?.id as string, commentId as string, req.body);
    res.status(200).json({
      success: true,
      date: result
    })

  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Update Process Not completed",
      details: err
    })
  }
}
//* Modarate Comment
const modarateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params

    const result = await commentService.modarateComment(commentId as string, req.body);
    res.status(200).json({
      success: true,
      date: result
    })

  } catch (err) {
    const errorMessage = (err instanceof Error) ? err.message : "Commnet Status update not completed";
    res.status(400).json({
      success: false,
      error: errorMessage,
      details: err
    })
  }
}


export const commentController = {
  createComment, getCommentById, getCommentByAuthorId, deleteComment, updateComment, modarateComment
}