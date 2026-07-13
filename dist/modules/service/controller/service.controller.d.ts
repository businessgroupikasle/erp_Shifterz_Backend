import type { Request, Response, NextFunction } from 'express';
import { ServiceService } from '../service/service.service.js';
export declare class ServiceController {
    private readonly service;
    constructor(service?: ServiceService);
    getAllServices: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createService: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateService: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteService: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=service.controller.d.ts.map