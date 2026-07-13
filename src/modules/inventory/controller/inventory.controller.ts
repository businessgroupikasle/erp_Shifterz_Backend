import type { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../service/inventory.service.js';

export class InventoryController {
  constructor(private readonly service: InventoryService = new InventoryService()) {}

  getAllItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const list = await this.service.getAllItems();
      res.json(list);
    } catch (error) {
      next(error);
    }
  };

  createItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.createItem(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  updateItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const result = await this.service.updateItem(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      await this.service.deleteItem(id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}
