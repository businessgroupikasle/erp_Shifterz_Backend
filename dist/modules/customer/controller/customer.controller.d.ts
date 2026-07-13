import type { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../service/customer.service.js';
import type { AuthRequest } from '../../../middleware/auth.middleware.js';
export declare class CustomerController {
    private readonly service;
    constructor(service?: CustomerService);
    getCustomers: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    createCustomer: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteCustomer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=customer.controller.d.ts.map