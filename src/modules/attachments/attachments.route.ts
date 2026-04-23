import { Router } from 'express';
import { AttachmentController } from './attachments.controller';
import { upload } from '../../utils/fileUpload';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

// --- PUBLIC ROUTES ---
router.get('/idea/:ideaId', AttachmentController.getIdeaAttachments);

// --- PROTECTED ROUTES ---
router.post(
  '/upload',
  authMiddleware(),
  upload.single('file'), // Multer middleware to handle multipart/form-data
  AttachmentController.uploadAttachment
);

router.delete(
  '/:id',
  authMiddleware(),
  AttachmentController.deleteAttachment
);

export const AttachmentRoutes = router;
