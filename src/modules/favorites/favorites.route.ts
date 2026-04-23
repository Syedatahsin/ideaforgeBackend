import { Router } from 'express';
import { FavoriteController } from './favorites.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

// --- PROTECTED ROUTES ---
router.get('/me', authMiddleware(), FavoriteController.getMyFavorites);
router.post('/:ideaId', authMiddleware(), FavoriteController.addFavorite);
router.delete('/:ideaId', authMiddleware(), FavoriteController.removeFavorite);

export const FavoriteRoutes = router;
