import type { Request, Response, NextFunction } from 'express';
import { VehicleCheckinService } from '../service/vehicle-checkin.service.js';
import type { AuthRequest } from '../../../middleware/auth.middleware.js';
export declare class VehicleCheckinController {
    private readonly service;
    constructor(service?: VehicleCheckinService);
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    create: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    checkout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=vehicle-checkin.controller.d.ts.map