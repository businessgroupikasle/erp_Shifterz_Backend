import type { Request, Response, NextFunction } from 'express';
import { ServiceService } from '../service/service.service.js';

export class ServiceController {
  constructor(private readonly service: ServiceService = new ServiceService()) {}

  getAllServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const list = await this.service.getAllServices();
      res.json(list);
    } catch (error) {
      next(error);
    }
  };

  createService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.createService(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  updateService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const result = await this.service.updateService(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      await this.service.deleteService(id);
      res.json({ success: true, message: "Service deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
