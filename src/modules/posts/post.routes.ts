import express from "express";
import { postController } from "./post.controller";
import { authMiddleware, UserRole } from "../../middleware/authMiddleware";

const router = express.Router();



router.post('/', authMiddleware(UserRole.USER, UserRole.ADMIN), postController.createPost)
router.get('/', postController.getAllPosts)
router.get('/my-posts', authMiddleware(UserRole.ADMIN, UserRole.USER), postController.getMyPost)
router.get('/stats', authMiddleware(UserRole.ADMIN), postController.getStats)
router.get('/:postId', postController.getPostById)
router.patch('/update/:postId', authMiddleware(UserRole.USER, UserRole.ADMIN), postController.updatePost)
router.delete('/delete/:postId', authMiddleware(UserRole.USER, UserRole.ADMIN), postController.deletePost)


export const postRouter = router