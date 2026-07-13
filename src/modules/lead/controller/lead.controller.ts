import type { Request, Response, NextFunction } from 'express';
import { LeadService } from '../service/lead.service.js';
import type { AuthRequest } from '../../../middleware/auth.middleware.js';

export class LeadController {
  private service: LeadService;

  constructor() {
    this.service = new LeadService();
  }

  getLeads = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      let tenantFilter = {};
      if (req.user) {
        if (req.user.role !== "SUPER_ADMIN" && req.user.role !== "HQ_USER" && req.user.franchiseId) {
          tenantFilter = { franchiseId: req.user.franchiseId };
        }
      }
      
      const leads = await this.service.getLeads(tenantFilter);
      res.json(leads);
    } catch (error) {
      next(error);
    }
  };

  createLead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const franchiseId = req.user?.franchiseId || null;
      const lead = await this.service.createLead(req.body, franchiseId);
      res.json(lead);
    } catch (error) {
      next(error);
    }
  };

  updateLead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const lead = await this.service.updateLead(id, req.body);
      res.json(lead);
    } catch (error) {
      next(error);
    }
  };

  deleteLead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      await this.service.deleteLead(id);
      res.json({ success: true, message: "Lead deleted" });
    } catch (error) {
      next(error);
    }
  };
}
