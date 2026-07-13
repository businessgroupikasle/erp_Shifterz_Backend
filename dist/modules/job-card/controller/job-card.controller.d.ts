import type { Request, Response, NextFunction } from 'express';
import { JobCardService } from '../service/job-card.service.js';
import type { AuthRequest } from '../../../middleware/auth.middleware.js';
export declare class JobCardController {
    private readonly service;
    constructor(service?: JobCardService);
    getJobs: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    createJob: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateJob: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteJob: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=job-card.controller.d.ts.map