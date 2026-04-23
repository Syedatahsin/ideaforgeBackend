import { Router } from 'express';
import { ReportController } from './reports.controller';
import { authMiddleware } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { reportSchema, updateReportStatusSchema } from './reports.validation';

const router = Router();

// --- PROTECTED ROUTES ---
router.post(
  '/idea/:ideaId', 
  authMiddleware(), 
  validateRequest(reportSchema), 
  ReportController.reportIdea
);

router.post(
  '/comment/:commentId', 
  authMiddleware(), 
  validateRequest(reportSchema), 
  ReportController.reportComment
);

// --- ADMIN ROUTES ---
router.get('/', authMiddleware('ADMIN'), ReportController.getAllReports);

router.patch(
  '/:id', 
  authMiddleware('ADMIN'), 
  validateRequest(updateReportStatusSchema), 
  ReportController.updateReportStatus
);

export const ReportRoutes = router;
