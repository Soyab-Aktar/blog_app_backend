import { CommentStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"

//! Create Comment
const createComment = async (payload: {
  content: string,
  authorId: string,
  postId: string,
  parentId?: string
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId
    }
  })
  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId
      }
    })

  }
  const result = await prisma.comment.create({
    data: payload
  })

  return result;
}

//! Get Comment By ID
const getCommentById = async (commentId: string) => {
  const result = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      postRelation: {
        select: {
          id: true,
          title: true,
          views: true
        }
      }
    }
  })

  return result;
}

//! Get Comments By Author ID
const getCommentByAuthorId = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      authorId: authorId
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      postRelation: {
        select: {
          id: true,
          title: true
        }
      }
    }
  })
  return result;
}
//! Delete Comment
const deleteComment = async (authorId: string, commentId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId: authorId
    },
    select: {
      id: true
    }
  })
  if (!commentData) {
    throw new Error("Your Provided input is invalid");
  }
  const result = await prisma.comment.delete({
    where: {
      id: commentData.id
    }
  })

  return result;
}
//! Update Comment
const updateComment = async (
  authorId: string,
  commentId: string,
  data: { content?: string, status?: CommentStatus }) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId: authorId
    },
    select: {
      id: true
    }
  })
  if (!commentData) {
    throw new Error("Your Provided input is invalid");
  }

  console.log({ commentData })

  return await prisma.comment.update({
    where: {
      id: commentId
    },
    data
  })

}

export const commentService = {
  createComment, getCommentById, getCommentByAuthorId, deleteComment, updateComment
}