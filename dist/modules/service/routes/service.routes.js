import { Router } from 'express';
import { ServiceController } from '../controller/service.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { createServiceSchema, updateServiceSchema } from '../validation/service.validation.js';
export const serviceRouter = Router();
const controller = new ServiceController();
// Use authentication for all routes
serviceRouter.use(authenticate);
serviceRouter.get('/', controller.getAllServices);
serviceRouter.post('/', validate(createServiceSchema), controller.createService);
serviceRouter.put('/:id', validate(updateServiceSchema), controller.updateService);
serviceRouter.delete('/:id', controller.deleteService);
//# sourceMappingURL=service.routes.js.map