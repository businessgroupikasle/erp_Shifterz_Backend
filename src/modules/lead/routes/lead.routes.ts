import { Router } from 'express';
import { LeadController } from '../controller/lead.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { createLeadSchema, updateLeadSchema } from '../validation/lead.validation.js';

export const leadRouter = Router();
const controller = new LeadController();

leadRouter.use(authenticate);

leadRouter.get('/', controller.getLeads);
leadRouter.post('/', validate(createLeadSchema), controller.createLead);
leadRouter.put('/:id', validate(updateLeadSchema), controller.updateLead);
leadRouter.delete('/:id', controller.deleteLead);
