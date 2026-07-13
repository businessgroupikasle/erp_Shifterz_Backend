import { Router } from 'express';
import { WorkshopController } from '../controller/workshop.controller.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
export const workshopRouter = Router();
const controller = new WorkshopController();
workshopRouter.use(authenticate);
workshopRouter.get('/dashboard', controller.getDashboard);
//# sourceMappingURL=workshop.routes.js.map