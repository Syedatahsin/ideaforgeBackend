import { Router } from 'express';
import { VoteController } from './votes.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

// --- PUBLIC ROUTES ---
router.get('/top', VoteController.getTopVotedIdeas);
router.get('/:ideaId', VoteController.getVoteStats);

// --- PROTECTED ROUTES ---
router.post('/upvote/:ideaId', authMiddleware(), VoteController.upvote);
router.post('/downvote/:ideaId', authMiddleware(), VoteController.downvote);
router.delete('/:ideaId', authMiddleware(), VoteController.removeVote);

export const VoteRoutes = router;
