import type { Request, Response, NextFunction } from 'express';
import { VehicleService } from '../service/vehicle.service.js';
export declare class VehicleController {
    private readonly service;
    constructor(service?: VehicleService);
    lookupVehicle: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=vehicle.controller.d.ts.map