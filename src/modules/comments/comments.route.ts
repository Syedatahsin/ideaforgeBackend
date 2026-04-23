import { Router } from 'express';
import { CommentController } from './comments.controller';
import { authMiddleware } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { createCommentSchema, updateCommentSchema, reportCommentSchema } from './comments.validation';

const router = Router();

// --- PUBLIC ROUTES ---
router.get('/idea/:ideaId', CommentController.getCommentsByIdea);

// --- PROTECTED ROUTES ---
router.get('/me', authMiddleware(), CommentController.getMyComments);

router.post(
  '/', 
  authMiddleware(), 
  validateRequest(createCommentSchema), 
  CommentController.createComment
);

router.post(
  '/:commentId/reply', 
  authMiddleware(), 
  validateRequest(createCommentSchema), // Reuse schema as it's the same
  CommentController.replyToComment
);

router.patch(
  '/:id', 
  authMiddleware(), 
  validateRequest(updateCommentSchema), 
  CommentController.updateComment
);

router.delete(
  '/:id', 
  authMiddleware(), 
  CommentController.deleteComment
);

router.post(
  '/:id/report', 
  authMiddleware(), 
  validateRequest(reportCommentSchema), 
  CommentController.reportComment
);

// --- ADMIN ROUTES ---
router.patch(
  '/:id/hide', 
  authMiddleware('ADMIN'), 
  CommentController.hideComment
);

router.patch(
  '/:id/restore', 
  authMiddleware('ADMIN'), 
  CommentController.restoreComment
);

router.delete(
  '/:id/admin', 
  authMiddleware('ADMIN'), 
  CommentController.hardDeleteComment
);

export const CommentRoutes = router;
