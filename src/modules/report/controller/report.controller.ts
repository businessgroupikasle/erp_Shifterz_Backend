import type { Request, Response, NextFunction } from 'express';
import { ReportService } from '../service/report.service.js';

export class ReportController {
  constructor(private readonly service: ReportService = new ReportService()) {}

  getReports = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getReports();
      res.json(data);
    } catch (error) {
      next(error);
    }
  };
}
