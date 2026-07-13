import type { Request, Response, NextFunction } from 'express';
import { BillingService } from '../service/billing.service.js';

export class BillingController {
  constructor(private readonly service: BillingService = new BillingService()) {}

  getAllInvoices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const list = await this.service.getAllInvoices();
      res.json(list);
    } catch (error) {
      next(error);
    }
  };

  createInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.createInvoice(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  updateInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const result = await this.service.updateInvoice(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      await this.service.deleteInvoice(id);
      res.json({ success: true, message: "Invoice deleted" });
    } catch (error) {
      next(error);
    }
  };
}
