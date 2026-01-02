import express from "express";
import { postController } from "./post.controller";
import { authMiddleware, UserRole } from "../../middleware/authMiddleware";

const router = express.Router();



router.post('/', authMiddleware(UserRole.USER), postController.createPost)


export const postRouter = router