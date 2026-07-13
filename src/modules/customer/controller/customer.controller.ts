import type { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../service/customer.service.js';
import type { AuthRequest } from '../../../middleware/auth.middleware.js';

export class CustomerController {
  constructor(private readonly service: CustomerService = new CustomerService()) {}

  getCustomers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      let tenantFilter = {};
      if (req.user) {
        if (req.user.role !== "SUPER_ADMIN" && req.user.role !== "HQ_USER" && req.user.franchiseId) {
          tenantFilter = { franchiseId: req.user.franchiseId };
        }
      }
      
      const customers = await this.service.getCustomers(tenantFilter);
      res.json(customers);
    } catch (error) {
      next(error);
    }
  };

  createCustomer = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const franchiseId = req.user?.franchiseId || null;
      const customer = await this.service.createCustomer(req.body, franchiseId);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  };

  deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      await this.service.deleteCustomer(id);
      res.json({ success: true, message: "Customer deleted" });
    } catch (error) {
      next(error);
    }
  };
}
