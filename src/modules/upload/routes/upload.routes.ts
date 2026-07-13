import { Router } from 'express';
import { UploadController } from '../controller/upload.controller.js';
import { upload } from '../config/multer.config.js';
import { authenticate } from '../../../middleware/auth.middleware.js';

export const uploadRouter = Router();
const controller = new UploadController();

uploadRouter.post('/', authenticate, upload.single("file"), controller.handleUpload);
