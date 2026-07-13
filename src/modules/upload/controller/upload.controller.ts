import type { Request, Response, NextFunction } from 'express';

export class UploadController {
  handleUpload = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }
      res.json({ url: `/uploads/${req.file.filename}` });
    } catch (error) {
      next(error);
    }
  };
}
