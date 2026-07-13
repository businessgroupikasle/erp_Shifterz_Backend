import type { Request, Response, NextFunction } from 'express';
import { BillingService } from '../service/billing.service.js';
export declare class BillingController {
    private readonly service;
    constructor(service?: BillingService);
    getAllInvoices: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createInvoice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateInvoice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteInvoice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=billing.controller.d.ts.map