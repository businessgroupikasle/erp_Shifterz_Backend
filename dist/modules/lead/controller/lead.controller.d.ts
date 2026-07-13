import type { Request, Response, NextFunction } from 'express';
import type { AuthRequest } from '../../../middleware/auth.middleware.js';
export declare class LeadController {
    private service;
    constructor();
    getLeads: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    createLead: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateLead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteLead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=lead.controller.d.ts.map