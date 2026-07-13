import type { Response, NextFunction } from 'express';
import { TransferService } from '../service/transfer.service.js';
import type { AuthRequest } from '../../../middleware/auth.middleware.js';
export declare class TransferController {
    private readonly service;
    constructor(service?: TransferService);
    getAllTransfers: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    createTransfer: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    approveTransfer: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    rejectTransfer: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateTransfer: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteTransfer: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=transfer.controller.d.ts.map