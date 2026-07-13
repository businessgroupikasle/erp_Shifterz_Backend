import type { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../service/inventory.service.js';
export declare class InventoryController {
    private readonly service;
    constructor(service?: InventoryService);
    getAllItems: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createItem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateItem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteItem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=inventory.controller.d.ts.map