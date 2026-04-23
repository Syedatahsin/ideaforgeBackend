import { Router } from 'express';
import { ReviewController } from './reviews.controller';
import { authMiddleware } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { createReviewSchema, updateReviewSchema } from './reviews.validation';

const router = Router();

// --- PUBLIC ROUTES ---
router.get('/idea/:ideaId', ReviewController.getIdeaReviews);

// --- PROTECTED ROUTES ---
router.post(
  '/', 
  authMiddleware(), 
  validateRequest(createReviewSchema), 
  ReviewController.upsertReview
);

router.patch(
  '/:id', 
  authMiddleware(), 
  validateRequest(updateReviewSchema), 
  ReviewController.updateReview
);

router.delete(
  '/:id', 
  authMiddleware(), 
  ReviewController.deleteReview
);

export const ReviewRoutes = router;
