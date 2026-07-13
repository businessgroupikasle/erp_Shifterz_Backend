import type { Response, NextFunction } from 'express';
import { FranchiseService } from '../service/franchise.service.js';
import type { AuthRequest } from '../../../middleware/auth.middleware.js';
export declare class FranchiseController {
    private readonly service;
    constructor(service?: FranchiseService);
    getAllFranchises: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    createFranchise: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateFranchise: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteFranchise: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=franchise.controller.d.ts.map