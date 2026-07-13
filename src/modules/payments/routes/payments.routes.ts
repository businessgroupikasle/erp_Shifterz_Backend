import { Router } from 'express';
import { PaymentsController } from '../controller/payments.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { createPaymentSchema } from '../validation/payments.validation.js';

export const paymentsRouter = Router();
const controller = new PaymentsController();

paymentsRouter.use(authenticate);

paymentsRouter.get('/', controller.getAllPayments);
paymentsRouter.post('/', validate(createPaymentSchema), controller.createPayment);
paymentsRouter.delete('/:id', controller.deletePayment);
