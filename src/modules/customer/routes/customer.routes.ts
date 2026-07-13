import { Router } from 'express';
import { CustomerController } from '../controller/customer.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { createCustomerSchema } from '../validation/customer.validation.js';

export const customerRouter = Router();
const controller = new CustomerController();

customerRouter.use(authenticate);

customerRouter.get('/', controller.getCustomers);
customerRouter.post('/', validate(createCustomerSchema), controller.createCustomer);
customerRouter.delete('/:id', controller.deleteCustomer);
