import express, { Router } from 'express';
import { commentController } from './comment.controller';
import { authMiddleware, UserRole } from '../../middleware/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware(UserRole.USER, UserRole.ADMIN), commentController.createComment);
router.get('/:commentId', commentController.getCommentById);
router.get('/author/:authorId', commentController.getCommentByAuthorId);
router.delete('/:commentId', authMiddleware(UserRole.ADMIN, UserRole.USER), commentController.deleteComment);
router.patch('/:commentId', authMiddleware(UserRole.ADMIN, UserRole.USER), commentController.updateComment);

export const commentRouter = router;