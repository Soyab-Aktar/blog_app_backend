import express from "express";
import { postController } from "./post.controller";
import { authMiddleware, UserRole } from "../../middleware/authMiddleware";

const router = express.Router();



router.post('/', authMiddleware(UserRole.USER), postController.createPost)
router.get('/', postController.getAllPosts)
router.get('/:postId', postController.getPostById)


export const postRouter = router