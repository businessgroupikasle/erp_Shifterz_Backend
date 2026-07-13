import type { Request, Response, NextFunction } from 'express';
import { FranchiseService } from '../service/franchise.service.js';
import type { AuthRequest } from '../../../middleware/auth.middleware.js';

export class FranchiseController {
  constructor(private readonly service: FranchiseService = new FranchiseService()) {}

  getAllFranchises = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const list = await this.service.getAllFranchises();
      res.json(list);
    } catch (error) {
      next(error);
    }
  };

  createFranchise = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.createFranchise(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  updateFranchise = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const result = await this.service.updateFranchise(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteFranchise = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      await this.service.deleteFranchise(id);
      res.json({ success: true, message: "Franchise deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
