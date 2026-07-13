import { Router } from 'express';
import { JobCardController } from '../controller/job-card.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { createJobCardSchema, updateJobCardSchema } from '../validation/job-card.validation.js';
export const jobCardRouter = Router();
const controller = new JobCardController();
jobCardRouter.use(authenticate);
jobCardRouter.get('/', controller.getJobs);
jobCardRouter.post('/', validate(createJobCardSchema), controller.createJob);
jobCardRouter.put('/:id', validate(updateJobCardSchema), controller.updateJob);
jobCardRouter.delete('/:id', controller.deleteJob);
//# sourceMappingURL=job-card.routes.js.map