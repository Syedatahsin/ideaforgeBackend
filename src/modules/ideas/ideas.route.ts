import { Router } from 'express';
import { IdeaController } from './ideas.controller';
import { authMiddleware } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { createIdeaSchema, updateIdeaSchema, adminUpdateStatusSchema } from './ideas.validation';

const router = Router();

// --- PUBLIC ROUTES ---
router.get('/', IdeaController.getAllApprovedIdeas);
router.get('/:id', IdeaController.getIdeaByIdOrSlug);

// --- PROTECTED ROUTES (AUTHENTICATED) ---
router.post(
  '/', 
  authMiddleware(), 
  validateRequest(createIdeaSchema), 
  IdeaController.createIdea
);

router.patch(
  '/:id', 
  authMiddleware(), 
  validateRequest(updateIdeaSchema), 
  IdeaController.updateIdea
);

router.delete(
  '/:id', 
  authMiddleware(), 
  IdeaController.deleteIdea
);

router.post(
  '/:id/submit', 
  authMiddleware(), 
  IdeaController.submitForReview
);

// --- ADMIN ROUTES ---
router.patch(
  '/:id/status', 
  authMiddleware('ADMIN'), 
  validateRequest(adminUpdateStatusSchema), 
  IdeaController.adminUpdateStatus
);

export const IdeaRoutes = router;
