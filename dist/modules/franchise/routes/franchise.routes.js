import { Router } from 'express';
import { FranchiseController } from '../controller/franchise.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import { authenticate } from '../../../middleware/auth.middleware.js';
import { createFranchiseSchema, updateFranchiseSchema } from '../validation/franchise.validation.js';
export const franchiseRouter = Router();
const controller = new FranchiseController();
// Use authentication for all routes
franchiseRouter.use(authenticate);
franchiseRouter.get('/', controller.getAllFranchises);
franchiseRouter.post('/', validate(createFranchiseSchema), controller.createFranchise);
franchiseRouter.put('/:id', validate(updateFranchiseSchema), controller.updateFranchise);
franchiseRouter.delete('/:id', controller.deleteFranchise);
//# sourceMappingURL=franchise.routes.js.map