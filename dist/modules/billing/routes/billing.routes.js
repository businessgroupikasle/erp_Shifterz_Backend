import { Router } from 'express';
import { BillingController } from '../controller/billing.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { createInvoiceSchema, updateInvoiceSchema } from '../validation/billing.validation.js';
export const billingRouter = Router();
const controller = new BillingController();
billingRouter.use(authenticate);
billingRouter.get('/', controller.getAllInvoices);
billingRouter.post('/', validate(createInvoiceSchema), controller.createInvoice);
billingRouter.put('/:id', validate(updateInvoiceSchema), controller.updateInvoice);
billingRouter.delete('/:id', controller.deleteInvoice);
//# sourceMappingURL=billing.routes.js.map