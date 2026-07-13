import type { Request, Response, NextFunction } from 'express';
import { ReportService } from '../service/report.service.js';
export declare class ReportController {
    private readonly service;
    constructor(service?: ReportService);
    getReports: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=report.controller.d.ts.map