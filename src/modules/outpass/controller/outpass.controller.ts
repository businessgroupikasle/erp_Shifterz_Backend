import type { Request, Response, NextFunction } from 'express';
import { OutpassService } from '../service/outpass.service.js';

export class OutpassController {
  constructor(private readonly service: OutpassService = new OutpassService()) {}

  getAllOutpasses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const list = await this.service.getAllOutpasses();
      res.json(list);
    } catch (error) {
      next(error);
    }
  };

  createOutpass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.createOutpass(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  updateOutpass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const result = await this.service.updateOutpass(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
