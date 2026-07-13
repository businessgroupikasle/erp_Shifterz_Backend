import type { Request, Response, NextFunction } from 'express';
import { PaymentsService } from '../service/payments.service.js';
export declare class PaymentsController {
    private readonly service;
    constructor(service?: PaymentsService);
    getAllPayments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deletePayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=payments.controller.d.ts.map