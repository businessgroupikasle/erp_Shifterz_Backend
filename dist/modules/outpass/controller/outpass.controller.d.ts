import type { Request, Response, NextFunction } from 'express';
import { OutpassService } from '../service/outpass.service.js';
export declare class OutpassController {
    private readonly service;
    constructor(service?: OutpassService);
    getAllOutpasses: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createOutpass: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateOutpass: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=outpass.controller.d.ts.map