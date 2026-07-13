import type { Response, NextFunction } from 'express';
import { EmployeeService } from '../service/employee.service.js';
import type { AuthRequest } from '../../../middleware/auth.middleware.js';
export declare class EmployeeController {
    private readonly service;
    constructor(service?: EmployeeService);
    getAllEmployees: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getHqEmployees: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    getTechnicians: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    createEmployee: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    createTechnician: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateEmployee: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteEmployee: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=employee.controller.d.ts.map