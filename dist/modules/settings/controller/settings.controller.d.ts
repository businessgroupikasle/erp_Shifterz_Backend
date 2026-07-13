import type { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../service/settings.service.js';
export declare class SettingsController {
    private readonly service;
    constructor(service?: SettingsService);
    getSettings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateSettings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=settings.controller.d.ts.map