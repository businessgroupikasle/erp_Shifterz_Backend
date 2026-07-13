import type { Response, NextFunction } from 'express';
import { WorkshopService } from '../service/workshop.service.js';
import type { AuthRequest } from '../../../middleware/auth.middleware.js';

export class WorkshopController {
  constructor(private readonly service: WorkshopService = new WorkshopService()) {}

  getDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      
      const summary = await this.service.getDashboardSummary(req.user.id);
      res.json(summary);
    } catch (error) {
      next(error);
    }
  };
}
