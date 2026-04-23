import { Router } from 'express';
import { NewsletterController } from './newsletter.controller';
import validateRequest from '../../middlewares/validateRequest';
import { newsletterSchema } from './newsletter.validation';

const router = Router();

// --- PUBLIC ROUTES (No login required) ---
router.post('/subscribe', validateRequest(newsletterSchema), NewsletterController.subscribe);
router.post('/unsubscribe', validateRequest(newsletterSchema), NewsletterController.unsubscribe);

export const NewsletterRoutes = router;
