import type { Response, NextFunction } from 'express';
import { AttendanceService } from '../service/attendance.service.js';
import type { AuthRequest } from '../../../middleware/auth.middleware.js';

export class AttendanceController {
  constructor(private readonly service: AttendanceService = new AttendanceService()) {}

  getAllAttendance = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role || "UNKNOWN";
      const userId = req.user?.id || "";
      const userFranchiseId = req.user?.franchiseId || undefined;
      const list = await this.service.getAllAttendance(userRole, userId, userFranchiseId);
      res.json(list);
    } catch (error) {
      next(error);
    }
  };

  checkIn = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.checkIn(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  checkOut = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.checkOut(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  updateAttendance = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const result = await this.service.updateAttendance(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
