import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client";
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
  sortBy: string,
  sortOrder: string,
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
    orderBy: {
      [payload.sortBy]: payload.sortOrder
    },
    include: {
      _count: {
        select: { comments: true }
      }
    }
  });

  const total = await prisma.post.count({
    where: {
      AND: andConditions
    }
  })
  const { page, limit, } = payload;
  return {
    data: allPosts,
    pagination: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),

    }
  }
}

// TODO : Get Post by Id
const getPostById = async (postId: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId
      },
      data: {
        views: {
          increment: 1
        }
      }
    })

    const postData = await tx.post.findUnique({
      where: {
        id: postId
      },
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommentStatus.APPROVED
          },
          orderBy: {
            createdAt: "desc"
          },
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED
              },
              orderBy: {
                createdAt: "asc"
              },
              include: {
                replies: {
                  where: {
                    status: CommentStatus.APPROVED
                  },
                  orderBy: {
                    createdAt: "asc"
                  }

                }

              }
            }
          }
        },
        _count: {
          select: { comments: true }
        }
      }
    })

    return postData;
  })
}

// TODO : Get Logged user post
const getMyPost = async (authorId: string) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
      status: "ACTIVE"
    },
    select: {
      id: true
    }
  })

  const result = await prisma.post.findMany({
    where: {
      authorId: authorId
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const total = await prisma.post.aggregate({
    _count: {
      id: true
    },
    where: {
      authorId
    }
  })

  return {
    data: result,
    total
  };
}

//TODO : Update post data
const updatePost = async (postId: string, data: Partial<Post>, userId: string, isAdmin: boolean) => {
  const postDate = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId
    },
    select: {
      id: true,
      authorId: true
    }
  })

  if (!isAdmin && (postDate.authorId !== userId)) {
    throw new Error('Not Authorised for this');
  }
  if (!isAdmin) {
    delete data.isFeatured;
  }

  return await prisma.post.update({
    where: {
      id: postId
    },
    data
  })
}

//TODO : Delete post
const deletePost = async (postId: string, data: Partial<Post>, userId: string, isAdmin: boolean) => {
  const postDate = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId
    },
    select: {
      id: true,
      authorId: true
    }
  })

  if (!isAdmin && (postDate.authorId !== userId)) {
    throw new Error('Not Authorised for this');
  }

  return await prisma.post.delete({
    where: {
      id: postId
    }
  })
}

//! Export
export const postService = {
  createPost, getAllPosts, getPostById, getMyPost, updatePost, deletePost
}