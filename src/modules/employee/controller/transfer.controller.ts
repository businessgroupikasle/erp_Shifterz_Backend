import type { Response, NextFunction } from 'express';
import { TransferService } from '../service/transfer.service.js';
import type { AuthRequest } from '../../../middleware/auth.middleware.js';

export class TransferController {
  constructor(private readonly service: TransferService = new TransferService()) {}

  getAllTransfers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const list = await this.service.getAllTransfers();
      res.json(list);
    } catch (error) {
      next(error);
    }
  };

  createTransfer = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const username = req.user?.id || ""; // Usually we extract username, fallback to id
      const role = req.user?.role || "UNKNOWN";
      const result = await this.service.createTransfer(req.body, username, role);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  approveTransfer = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const role = req.user?.role || "UNKNOWN";
      const result = await this.service.approveTransfer(id, role);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  rejectTransfer = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const role = req.user?.role || "UNKNOWN";
      const result = await this.service.rejectTransfer(id, role);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  updateTransfer = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const result = await this.service.updateTransfer(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteTransfer = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      await this.service.deleteTransfer(id);
      res.json({ success: true, message: "Deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
