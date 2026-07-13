import type { Response, NextFunction } from 'express';
import { WorkshopService } from '../service/workshop.service.js';
import type { AuthRequest } from '../../../middleware/auth.middleware.js';
export declare class WorkshopController {
    private readonly service;
    constructor(service?: WorkshopService);
    getDashboard: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=workshop.controller.d.ts.map