import type { Response, NextFunction } from 'express';
import { AttendanceService } from '../service/attendance.service.js';
import type { AuthRequest } from '../../../middleware/auth.middleware.js';
export declare class AttendanceController {
    private readonly service;
    constructor(service?: AttendanceService);
    getAllAttendance: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    checkIn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    checkOut: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
    updateAttendance: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=attendance.controller.d.ts.map