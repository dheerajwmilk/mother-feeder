import express from 'express';
import { auth, authorize } from '../middleware/auth';
import { upsertCaretakerProfile, getMyCaretakerProfile, uploadCaretakerDocument } from '../controllers/caretakerController';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const router = express.Router();

// Configure Cloudinary (ensure secure URLs)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Multer memory storage for direct upload to Cloudinary (limit 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Get logged-in caregiver profile
router.get('/me', auth, authorize('caregiver', 'admin'), getMyCaretakerProfile);

// Create or update caregiver onboarding/profile data
router.post('/profile', auth, authorize('caregiver', 'admin'), upsertCaretakerProfile);

// Upload verification document -> Cloudinary -> store URL
router.post(
  '/upload',
  auth,
  authorize('caregiver', 'admin'),
  upload.single('file'),
  async (req, res) => {
    try {
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return res.status(500).json({ message: 'Cloudinary not configured. Missing environment variables.' });
      }
      if (!req.file || !req.file.buffer) return res.status(400).json({ message: 'No file uploaded' });

      const folder = 'neonest/caregiver_docs';
      const options = { folder, resource_type: 'auto' as const };
      const uploadStream = cloudinary.uploader.upload_stream(options, async (err, result) => {
        try {
          if (err || !result) {
            console.error('Cloudinary upload error:', err);
            return res.status(500).json({ message: 'Cloudinary upload failed', error: err?.message || 'Unknown error' });
          }
          (req as any).fileUrl = result.secure_url;
          return uploadCaretakerDocument(req as any, res as any);
        } catch (innerErr: any) {
          console.error('Post-upload handling failed:', innerErr);
          return res.status(500).json({ message: 'Post-upload handling failed', error: innerErr?.message });
        }
      });

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } catch (e: any) {
      return res.status(500).json({ message: 'Upload error', error: e.message });
    }
  }
);

// Multer error handler for this router (e.g., file too large)
router.use('/upload', (err: any, _req: any, res: any, _next: any) => {
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'File too large. Max 10MB allowed.' });
  }
  if (err) {
    console.error('Upload route error:', err);
    return res.status(400).json({ message: err.message || 'Upload error' });
  }
});

export default router;


