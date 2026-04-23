import multer from 'multer';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import config from '../config';
import { AttachmentType } from '../generated/prisma/client';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import { Readable } from 'stream';

// --- CLOUDINARY CONFIG ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- MULTER CONFIG ---
// We use memory storage because we stream directly to Cloudinary
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

/**
 * Uploads a buffer to Cloudinary and returns the result.
 */
export const uploadToCloudinary = (
  file: Express.Multer.File
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'ideaforge/attachments',
        resource_type: 'auto', // Automatically detect image, video, or raw (for PDF)
      },
      (error, result) => {
        if (error || !result) {
          reject(new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Cloudinary Upload Failed'));
        } else {
          resolve(result);
        }
      }
    );

    // Convert Buffer to Stream and pipe to Cloudinary
    const stream = new Readable();
    stream.push(file.buffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
};

/**
 * Maps mimetype to AttachmentType enum.
 */
export const mapMimetypeToType = (mimetype: string): AttachmentType => {
  if (mimetype.startsWith('image/')) return AttachmentType.IMAGE;
  if (mimetype.startsWith('video/')) return AttachmentType.VIDEO;
  if (mimetype === 'application/pdf') return AttachmentType.PDF;
  
  throw new AppError(httpStatus.BAD_REQUEST, `Unsupported file type: ${mimetype}`);
};
